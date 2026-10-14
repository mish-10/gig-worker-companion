import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instructions for AI Companion
const SYSTEM_INSTRUCTION_CHAT = `You are "Gig Worker Companion" (गीग वर्कर साथी), an expert, deeply empathetic, and legally astute assistant created specifically for Indian gig and platform workers (including food & grocery delivery partners with Swiggy, Zomato, Zepto, Blinkit; cab, auto, and bike taxi drivers with Uber, Ola, Rapido, inDrive; logistics riders with Porter, Shadowfax, Delhivery, Amazon Flex; and home service partners like Urban Company).

Your responsibilities:
1. Provide accurate, practical, actionable advice on:
   - Worker rights, platform contracts, arbitrary deactivations, unfair penalties, and grievance redressal mechanisms.
   - Indian welfare schemes (e-Shram card benefits, PMSBY, PMJJBY, Ayushman Bharat PM-JAY, state-specific gig worker boards like Rajasthan & Karnataka).
   - Taxes & finances: 1% TDS deduction under Section 194-O / 194C, how to claim refunds by filing ITR-4 or ITR-1, vehicle financing, saving fuel costs, daily budgeting.
   - On-road safety, dealing with traffic police / challans, DigiLocker legal validity for DL/RC, emergency protocols during road accidents, platform insurance claims (Digit, ICICI Lombard, Acko).
   - Dealing with customer aggression, abusive ratings, fake Cash-on-Delivery (COD) claims, and app technical glitches.
2. Language response:
   - If user asks in Hindi or asks for Hindi, respond in clear, easy-to-understand Hindi (using Devanagari script). You may use commonly known English terms (like "e-Shram", "ID", "Insurance", "TDS", "Grievance Officer", "Helpdesk", "Police") written naturally.
   - If user asks in English, respond in clear, supportive English with Indian context (₹ Rupee symbols, Indian legal bodies, helpline numbers).
   - Keep answers clear, well-structured with bullet points or numbered steps, and easy to read on mobile screens while between delivery orders or driving shifts.
3. Be strictly factual and empathetic. Never fabricate government rules or fake legal citations. Encourage workers and provide realistic, empowering steps.`;

// System instructions for Complaint Generator
const SYSTEM_INSTRUCTION_COMPLAINT = `You are a legal and formal dispute documentation expert specializing in Indian gig economy disputes and labor laws.
Generate a structured, professional, assertive, and legally sound formal complaint email/letter that an Indian gig worker (delivery rider, cab driver, etc.) can send to their platform's Grievance Officer, Customer/Partner Support, and escalate to the District Labor Conciliation Officer or National Consumer Forum (NCH / e-Daakhil) if ignored.

Include:
- Subject Line: Crisp, formal, with Worker ID and specific grievance
- Date & Recipient Details: Addressed to Grievance Officer of the platform
- Complainant Details: Worker Name, Registered Mobile, Partner ID, City
- Factual Chronology of Issue: Clear summary of what happened (unpaid earnings, wrongful deduction, sudden blocking, false customer report, etc.)
- Legal Grounds & Precedents: Reference Information Technology (Intermediary Guidelines) Rules Section 11 (Grievance Officer duties), Consumer Protection Act 2019 / unfair trade practices, Code on Social Security 2020 platform worker provisions, and right to fair hearing (Natural Justice).
- Demands for Rectification: Clear timeline (e.g., 7 working days) to credit dues or restore account.
- Escalation Clause: Clear notice that failure to resolve will lead to filing on National Consumer Helpline (1915), Ministry of Consumer Affairs, e-Daakhil, and the State Labor Commissioner.
Provide the letter in the chosen language (Hindi or English). Format cleanly with placeholders or prefilled details.`;

// 1. Health check endpoint
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

// 1. Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    primaryModel: CANDIDATE_MODELS[0],
    models: CANDIDATE_MODELS,
  });
});

function sanitizeMessagesForGemini(messages: Array<{ role: string; content: string }>) {
  if (!Array.isArray(messages)) return [];

  // Filter non-empty valid strings
  const valid = messages
    .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === 'model' || m.role === 'assistant' ? ('model' as const) : ('user' as const),
      content: m.content.trim(),
    }));

  // Gemini multi-turn conversation MUST start with a 'user' turn
  while (valid.length > 0 && valid[0].role !== 'user') {
    valid.shift();
  }

  if (valid.length === 0) return [];

  // Ensure alternating roles by combining consecutive turns of the same role
  const collapsed: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];
  for (const m of valid) {
    const last = collapsed[collapsed.length - 1];
    if (last && last.role === m.role) {
      last.parts[0].text += '\n\n' + m.content;
    } else {
      collapsed.push({
        role: m.role,
        parts: [{ text: m.content }],
      });
    }
  }

  // Ensure conversation ends with 'user' turn to generate model reply
  if (collapsed.length > 0 && collapsed[collapsed.length - 1].role !== 'user') {
    collapsed.pop();
  }

  return collapsed;
}

function extractCleanErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  let msg = err.message || String(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.message) {
      msg = parsed.error.message;
    }
  } catch {
    // not JSON, keep msg as is
  }
  return msg;
}

async function executeWithModelFallback(
  callFn: (modelName: string) => Promise<any>
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await callFn(model);
      const text = response?.text;
      if (text) {
        return { text, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} encountered error:`, err?.message || err);
      lastError = err;
      // Continue to next model on quota (429) or transient unavailable (503)
      continue;
    }
  }

  throw lastError || new Error('All supported AI models failed to return a response.');
}

// 2. Real Gemini Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, language } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured in the server environment.',
        details: 'Please set GEMINI_API_KEY in the Secrets panel in AI Studio.',
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    let formattedContents = sanitizeMessagesForGemini(messages);

    // If sanitization emptied contents (e.g. only model greetings), fallback to latest message as user query
    if (formattedContents.length === 0) {
      const lastMsg = messages.slice().reverse().find((m) => m && m.content && String(m.content).trim().length > 0);
      if (lastMsg) {
        formattedContents = [{ role: 'user', parts: [{ text: String(lastMsg.content).trim() }] }];
      } else {
        return res.status(400).json({ error: 'At least one user message with content is required.' });
      }
    }

    const langInstruction =
      language === 'hi'
        ? '\nPlease respond in Hindi (Devanagari script) with warm, simple, and practical vocabulary.'
        : '\nPlease respond in English.';

    // 24-second timeout promise
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out after 24 seconds. Please try again.')), 24000)
    );

    const callPromise = executeWithModelFallback((model) =>
      ai.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_CHAT + langInstruction,
          temperature: 0.7,
        },
      })
    );

    const result = await Promise.race([callPromise, timeoutPromise]);

    return res.json({
      role: 'model',
      content: result.text,
      modelUsed: result.modelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error calling Gemini API for chat:', error);
    const cleanError = extractCleanErrorMessage(error);
    return res.status(500).json({
      error: cleanError,
      details: 'Ensure your server environment has a valid GEMINI_API_KEY in the Secrets panel.',
    });
  }
});

// 3. Real Gemini Complaint Generator endpoint
app.post('/api/generate-complaint', async (req: Request, res: Response) => {
  try {
    const {
      platform,
      workerName,
      workerId,
      city,
      phoneNumber,
      disputeType,
      disputeDate,
      amountInDispute,
      incidentDetails,
      language,
    } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured in the server environment.',
        details: 'Please set GEMINI_API_KEY in the Secrets panel in AI Studio.',
      });
    }

    if (!platform || !incidentDetails) {
      return res.status(400).json({
        error: 'Platform and incident details are required.',
      });
    }

    const promptText = `Generate a formal dispute complaint letter with the following parameters:
- Platform / Company: ${platform}
- Complainant Name: ${workerName || 'Partner'}
- Worker / Partner ID: ${workerId || 'Pending'}
- City / State: ${city || 'India'}
- Registered Phone: ${phoneNumber || 'Not provided'}
- Nature of Dispute: ${disputeType || 'Work-related dispute'}
- Incident Date: ${disputeDate || 'Recent'}
- Disputed Amount (if any): ${amountInDispute ? `₹${amountInDispute}` : 'N/A'}
- Detailed Incident Description: ${incidentDetails}
- Target Output Language: ${language === 'hi' ? 'Hindi (Devanagari)' : 'English'}

Provide:
1. Subject line
2. Formal letter ready to copy, with professional salutations, facts, Indian legal/regulatory citations, 7-day deadline, and escalation warning to National Consumer Helpline 1915 / Labour Commissioner.
3. Recommended next steps for the worker (where to email, what documents to attach like screenshot of earnings/trip, ticket ID).`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Complaint generation timed out after 24 seconds. Please try again.')), 24000)
    );

    const callPromise = executeWithModelFallback((model) =>
      ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_COMPLAINT,
          temperature: 0.5,
        },
      })
    );

    const result = await Promise.race([callPromise, timeoutPromise]);

    return res.json({
      complaint: result.text,
      modelUsed: result.modelUsed,
      platform,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating complaint with Gemini:', error);
    const cleanError = extractCleanErrorMessage(error);
    return res.status(500).json({
      error: cleanError,
      details: 'Ensure your server environment has a valid GEMINI_API_KEY in the Secrets panel.',
    });
  }
});



// Setup Vite middleware in dev or static server in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  if (!isProd && !hasDist) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Gig Worker Companion running on port ${port} (mode: ${isProd || hasDist ? 'production' : 'development'})`);
  });
}

startServer();

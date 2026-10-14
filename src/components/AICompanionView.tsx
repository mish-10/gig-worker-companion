import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Languages,
  Square,
  KeyRound,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage } from '../types';

export const AICompanionView: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('gig_companion_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'welcome',
        role: 'model',
        content:
          language === 'hi'
            ? 'नमस्ते साथी! मैं आपका **गीग वर्कर AI साथी** हूँ।\n\nआप मुझसे डिलीवरी या ड्राइविंग से जुड़े किसी भी विषय पर पूछ सकते हैं:\n* **प्लेटफॉर्म नियम व विवाद:** आईडी ब्लॉक होना, गलत पेनाल्टी कटना, रेटिंग विवाद\n* **सरकारी योजनाएं:** ई-श्रम कार्ड लाभ, PMSBY ₹2 लाख बीमा, आयुष्मान भारत\n* **टैक्स व बचत:** 1% टीडीएस रिफंड पाना, पेट्रोल खर्च कम करना\n* **सड़क सुरक्षा व अधिकार:** एक्सीडेंट के बाद कैशलेस बीमा क्लेम, ट्रैफिक पुलिस चेकिंग में कानूनी अधिकार\n\nआप हिंदी या अंग्रेजी किसी भी भाषा में पूछ सकते हैं।'
            : 'Hello Partner! I am your **Gig Worker AI Companion**.\n\nI am here to assist you with real-time, practical guidance on:\n* **Platform Grievances:** Arbitrary account suspension, unfair deduction, fake customer COD claims\n* **Government Social Security:** e-Shram UAN benefits, PMSBY accidental insurance, PM-JAY health cover\n* **Finances & Taxes:** Reclaiming 1% TDS (Section 194-O) from Income Tax, fuel optimization\n* **Road Safety & Legal Rights:** DigiLocker validity under CMVR Rule 139, post-accident cashless insurance claims\n\nFeel free to ask any question in English, Hindi, or Hinglish!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('gig_companion_chat', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const suggestedPrompts = [
    {
      en: 'How to claim insurance if I meet with an accident while on delivery shift?',
      hi: 'डिलीवरी के दौरान एक्सीडेंट होने पर कंपनी से बीमा कैसे क्लेम करें?',
    },
    {
      en: 'Zomato/Swiggy deducted an unfair penalty for a cancelled order. How to dispute?',
      hi: 'कैंसिल ऑर्डर पर कंपनी ने गलत पेनाल्टी काट ली है, इसे वापस कैसे पाएं?',
    },
    {
      en: 'How can delivery partners and cab drivers claim 1% TDS refund from Income Tax?',
      hi: 'गीग कामगार 1% टीडीएस (TDS) रिफंड आयकर विभाग से वापस कैसे क्लेम करें?',
    },
    {
      en: 'What are the exact benefits of e-Shram card for delivery riders and cab drivers?',
      hi: 'डिलीवरी राइडर और कैब चालकों के लिए ई-श्रम कार्ड के क्या-क्या फायदे हैं?',
    },
    {
      en: 'Can traffic police seize vehicle keys or reject DigiLocker DL & RC?',
      hi: 'क्या ट्रैफिक पुलिस गाड़ी की चाबी निकाल सकती है या डिजीलॉकर को अमान्य बता सकती है?',
    },
    {
      en: 'Practical tips to save petrol and reduce bike maintenance costs on daily shifts?',
      hi: 'रोजाना शिफ्ट में पेट्रोल और बाइक मेंटेनेंस का खर्च बचाने के सबसे असरदार तरीके?',
    },
  ];

  const abortControllerRef = useRef<AbortController | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasGeminiKey) {
          setApiKeyMissing(true);
        }
      })
      .catch((err) => console.warn('Health check error:', err));
  }, []);

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    setErrorMessage(null);
    const userMsgId = 'user-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputPrompt('');
    setIsLoading(true);

    // Filter out welcome message and previous error bubbles so Gemini receives a clean user/model sequence
    const apiPayloadMessages = updatedMessages
      .filter((m) => m.id !== 'welcome' && !m.isError && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    // Setup 24-second client timeout
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutTimer = setTimeout(() => {
      controller.abort();
    }, 24000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiPayloadMessages,
          language,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutTimer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 500 && errorData.error?.includes('API key')) {
          setApiKeyMissing(true);
        }
        throw new Error(
          errorData.error || `Server responded with status code ${response.status}`
        );
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: 'model-' + Date.now(),
        role: 'model',
        content: data.content || 'No response returned from Gemini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      console.error('Chat error:', err);

      let errMsg = err?.message || 'Failed to connect to Gemini AI.';
      if (err?.name === 'AbortError') {
        errMsg =
          language === 'hi'
            ? 'प्रतिक्रिया में 24 सेकंड से अधिक समय लगा। कृपया पुनः प्रयास करें।'
            : 'Request timed out after 24 seconds. Please try again.';
      }

      setErrorMessage(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'model',
          content:
            language === 'hi'
              ? `क्षमा करें, AI उत्तर प्राप्त करने में समस्या हुई: ${errMsg}`
              : `Sorry, there was an issue connecting to Gemini: ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      clearTimeout(timeoutTimer);
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (
      window.confirm(
        language === 'hi' ? 'क्या आप चैट इतिहास साफ करना चाहते हैं?' : 'Clear conversation history?'
      )
    ) {
      setMessages([]);
      localStorage.removeItem('gig_companion_chat');
    }
  };

  // Helper to format markdown bold and lists nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Header line
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-base mt-2">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-extrabold text-slate-900 text-lg mt-3">
                {line.replace('## ', '')}
              </h3>
            );
          }

          // Bullet points
          if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const clean = line.trim().substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{renderBoldSpans(clean)}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">{numMatch[1]}.</span>
                <span>{renderBoldSpans(numMatch[2])}</span>
              </div>
            );
          }

          return <p key={idx}>{renderBoldSpans(line)}</p>;
        })}
      </div>
    );
  };

  const renderBoldSpans = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('aiCompanionTitle')}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl mt-0.5">{t('aiCompanionDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}</span>
          </button>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title={t('clearChat')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 px-1">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>{t('suggestedQuestions')}:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {suggestedPrompts.map((item, index) => {
            const promptText = language === 'hi' ? item.hi : item.en;
            return (
              <button
                key={index}
                onClick={() => handleSendMessage(promptText)}
                disabled={isLoading}
                className="shrink-0 text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl px-3 py-2 transition-all shadow-2xs text-left max-w-xs line-clamp-2 disabled:opacity-50"
              >
                {promptText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs min-h-[460px] flex flex-col justify-between overflow-hidden">
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[580px]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : msg.isError
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] rounded-2xl p-4 text-slate-800 shadow-2xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : msg.isError
                      ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
                      : 'bg-slate-50 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  {/* Header/Timestamp */}
                  <div
                    className={`flex items-center justify-between text-[11px] mb-1.5 pb-1 border-b gap-4 ${
                      isUser
                        ? 'border-blue-500/50 text-blue-100'
                        : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="font-semibold">
                      {isUser
                        ? language === 'hi'
                          ? 'आप (पार्टनर)'
                          : 'You (Partner)'
                        : language === 'hi'
                        ? 'गीग वर्कर AI साथी'
                        : 'Gig Worker AI'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {!isUser && !msg.isError && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-blue-600 transition-colors p-0.5 rounded"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className={isUser ? 'text-white text-sm' : ''}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-2xs max-w-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>
                    {language === 'hi'
                      ? 'जेमिनी 3.8 Flash उत्तर तैयार कर रहा है...'
                      : 'Gemini 3.8 Flash is generating real-time response...'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current text-rose-500" />
                    <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/80">
          {errorMessage && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="font-bold underline text-rose-700 hover:text-rose-900 ml-2"
              >
                Retry
              </button>
            </div>
          )}

          {apiKeyMissing && (
            <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'AI Studio Secrets में GEMINI_API_KEY सेट नहीं है।'
                    : 'GEMINI_API_KEY is not set. Please configure it in the Secrets panel.'}
                </span>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLoading) {
                handleStopGenerating();
              } else {
                handleSendMessage();
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                isLoading
                  ? language === 'hi'
                    ? 'AI उत्तर लिख रहा है...'
                    : 'Generating response (press Stop to cancel)...'
                  : t('aiPlaceholder')
              }
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all disabled:bg-slate-50"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={handleStopGenerating}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-3 rounded-xl shadow-xs transition-all active:scale-95 shrink-0 flex items-center gap-1.5 text-xs"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputPrompt.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold p-3 rounded-xl shadow-xs transition-all active:scale-95 disabled:active:scale-100 shrink-0 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>

          <p className="text-[11px] text-center text-slate-400 mt-2">
            {language === 'hi'
              ? 'वास्तविक जेमिनी 3.8 Flash मॉडल द्वारा संचालित। अपने कानूनी व प्लेटफॉर्म अधिकारों की स्वतंत्र पुष्टि अवश्य करें।'
              : 'Powered directly by Google Gemini 3.8 Flash via secure server runtime. No hardcoded mock responses.'}
          </p>
        </div>
      </div>
    </div>
  );
};

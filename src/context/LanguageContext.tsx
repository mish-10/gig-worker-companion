import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; hi: string }> = {
  // App brand & navigation
  appName: { en: 'Gig Worker Companion', hi: 'गीग वर्कर साथी' },
  tagline: {
    en: 'Empowering Indian delivery partners, cab drivers & gig workers',
    hi: 'भारतीय डिलीवरी पार्टनर्स, कैब ड्राइवर्स और गीग कामगारों का भरोसेमंद साथी',
  },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  aiCompanion: { en: 'AI Companion', hi: 'AI साथी' },
  earningsTracker: { en: 'Earnings Tracker', hi: 'कमाई ट्रैकर' },
  schemes: { en: 'Govt Schemes', hi: 'सरकारी योजनाएं' },
  safetyCentre: { en: 'Safety Centre', hi: 'सुरक्षा केंद्र' },
  documentAssistant: { en: 'Document Assistant', hi: 'दस्तावेज मार्गदर्शक' },
  complaintGenerator: { en: 'Complaint Generator', hi: 'शिकायत पत्र जेनरेटर' },
  emergencySos: { en: 'Emergency SOS', hi: 'आपातकालीन SOS' },

  // Dashboard
  welcomeBack: { en: 'Welcome back, Partner', hi: 'स्वागत है, साथी' },
  todayEarnings: { en: "Today's Net Take-Home", hi: 'आज की शुद्ध कमाई' },
  thisWeekEarnings: { en: "This Week's Net", hi: 'इस हफ्ते की शुद्ध कमाई' },
  avgHourlyRate: { en: 'Avg Net / Hour', hi: 'प्रति घंटा शुद्ध दर' },
  tripsCompleted: { en: 'Completed Trips', hi: 'कुल ट्रिप्स/ऑर्डर्स' },
  demoDataBadge: { en: 'Demo Data Loaded', hi: 'डेमो डेटा लोड किया गया' },
  demoDataExpl: {
    en: 'Sample delivery & cab driver entries for demonstration. You can add your own real shifts anytime.',
    hi: 'प्रदर्शन के लिए डिलीवरी और कैब ड्राइवर की नमूना एंट्री। आप कभी भी अपनी वास्तविक शिफ्ट जोड़ सकते हैं।',
  },
  quickActions: { en: 'Quick Tools & Actions', hi: 'त्वरित टूल्स और सुविधाएं' },
  recentShifts: { en: 'Recent Shift Log', hi: 'हालिया शिफ्ट लॉग' },
  safetyTipTitle: { en: "Today's Road & Safety Tip", hi: 'आज की सड़क सुरक्षा सलाह' },
  emergencyHelplines: { en: 'Emergency Helplines', hi: 'आपातकालीन हेल्पलाइन' },

  // AI Companion
  aiCompanionTitle: { en: 'AI Gig Worker Companion', hi: 'AI गीग वर्कर साथी' },
  aiCompanionDesc: {
    en: 'Ask anything about platform rules, e-Shram benefits, unfair deductions, road safety, tax refunds (TDS), or insurance claims. Powered by Gemini 3.8 Flash.',
    hi: 'प्लेटफॉर्म नियमों, ई-श्रम लाभों, अनुचित कटौतियों, सड़क सुरक्षा, टीडीएस रिफंड या बीमा दावों के बारे में कुछ भी पूछें। जेमिनी AI द्वारा संचालित।',
  },
  aiPlaceholder: {
    en: 'Ask a question in English or Hindi (e.g. Swiggy ID blocked, road accident claim, TDS refund)...',
    hi: 'हिंदी या अंग्रेजी में सवाल पूछें (उदा. आईडी ब्लॉक हो गई, एक्सीडेंट क्लेम, टीडीएस रिफंड)...',
  },
  send: { en: 'Send', hi: 'भेजें' },
  clearChat: { en: 'Clear Chat', hi: 'चैट साफ करें' },
  suggestedQuestions: { en: 'Suggested Questions', hi: 'सुझाए गए प्रश्न' },

  // Earnings
  addShift: { en: 'Add Shift / Day Entry', hi: 'नई शिफ्ट / दैनिक एंट्री जोड़ें' },
  resetDemoData: { en: 'Reset to Sample Data', hi: 'नमूना डेटा रीसेट करें' },
  clearAll: { en: 'Clear All Entries', hi: 'सभी एंट्री हटाएं' },
  filterPlatform: { en: 'Filter by Platform', hi: 'प्लेटफॉर्म अनुसार फ़िल्टर करें' },
  allPlatforms: { en: 'All Platforms', hi: 'सभी प्लेटफॉर्म' },
  grossFare: { en: 'Gross Earnings / Fares', hi: 'कुल किराया / कमाई' },
  incentives: { en: 'Incentives & Surge', hi: 'इंसेंटिव और सर्ज' },
  tips: { en: 'Customer Tips', hi: 'टिप्स' },
  fuelCost: { en: 'Fuel / EV Charge Cost', hi: 'पेट्रोल / चार्जिंग खर्च' },
  maintenance: { en: 'Bike / Car Repairs', hi: 'गाड़ी मरम्मत व सर्विस' },
  foodData: { en: 'Food & Mobile Recharge', hi: 'खाना व मोबाइल डेटा' },
  deductions: { en: 'Platform Deductions / TDS', hi: 'कटौती व टीडीएस' },
  netTakeHome: { en: 'Net Take-Home', hi: 'शुद्ध बचत (Take-Home)' },
  saveEntry: { en: 'Save Shift Entry', hi: 'एंट्री सुरक्षित करें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  date: { en: 'Date', hi: 'तारीख' },
  platform: { en: 'Platform', hi: 'प्लेटफॉर्म' },
  hours: { en: 'Hours', hi: 'घंटे' },
  trips: { en: 'Trips/Orders', hi: 'ट्रिप्स / ऑर्डर्स' },

  // Schemes
  searchSchemes: { en: 'Search government schemes...', hi: 'सरकारी योजनाएं खोजें...' },
  allCategories: { en: 'All Categories', hi: 'सभी श्रेणियां' },
  eligibility: { en: 'Who is Eligible', hi: 'पात्रता (योग्यता)' },
  keyBenefits: { en: 'Key Benefits', hi: 'प्रमुख लाभ' },
  howToApply: { en: 'Step-by-Step Application', hi: 'आवेदन की प्रक्रिया' },
  requiredDocs: { en: 'Required Documents', hi: 'जरूरी दस्तावेज' },
  visitOfficialPortal: { en: 'Visit Official Govt Portal', hi: 'आधिकारिक पोर्टल पर जाएं' },

  // Safety
  callNow: { en: 'Call Now', hi: 'अभी कॉल करें' },
  tapToCall: { en: 'Tap to call directly', hi: 'सीधे कॉल करने के लिए टैप करें' },
  postAccidentProtocol: { en: 'Post-Accident Immediate Protocol', hi: 'दुर्घटना के तुरंत बाद क्या करें' },
  weatherAdvisory: { en: 'Weather & Heatwave Guidance', hi: 'मौसम और लू से बचाव निर्देश' },
  policeRights: { en: 'Police Checking & Traffic Rights', hi: 'पुलिस चेकिंग और कानूनी अधिकार' },

  // Document Assistant
  docTitle: { en: 'Gig Worker Document Assistant', hi: 'गीग वर्कर दस्तावेज मार्गदर्शक' },
  docSubtitle: {
    en: 'Clear guide to getting your Driving Licence, Commercial Insurance, e-Shram Card, and claiming 1% TDS refund.',
    hi: 'ड्राइविंग लाइसेंस, कॉमर्शियल बीमा, ई-श्रम कार्ड और 1% टीडीएस रिफंड पाने का सरल और स्पष्ट गाइड।',
  },

  // Complaint Generator
  complaintTitle: { en: 'Dispute & Complaint Generator', hi: 'शिकायत व विवाद पत्र जेनरेटर' },
  complaintSubtitle: {
    en: 'Draft legal-grade formal complaints for unpaid dues, unfair penalties, arbitrary ID suspension, and insurance disputes.',
    hi: 'बकाया भुगतान, अनुचित जुर्माने, अचानक आईडी बंद होने और बीमा विवादों के लिए आधिकारिक शिकायत पत्र तैयार करें।',
  },
  generateLetter: { en: 'Generate Formal Complaint', hi: 'शिकायत पत्र तैयार करें' },
  generating: { en: 'Drafting with Gemini AI...', hi: 'जेमिनी AI द्वारा ड्राफ्ट किया जा रहा है...' },
  copyComplaint: { en: 'Copy Letter to Clipboard', hi: 'पत्र कॉपी करें' },
  downloadComplaint: { en: 'Download as Text File', hi: 'टेक्स्ट फाइल डाउनलोड करें' },
  copiedNotice: { en: 'Copied to clipboard!', hi: 'क्लिपबोर्ड पर कॉपी हो गया!' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gig_companion_lang');
    return (saved === 'hi' || saved === 'en' ? saved : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gig_companion_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

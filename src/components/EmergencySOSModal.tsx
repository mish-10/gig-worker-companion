import React from 'react';
import { Phone, X, AlertTriangle, Shield, HeartPulse, Truck, Scale, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { emergencyHotlines } from '../data/mockData';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-red-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {language === 'hi' ? 'आपातकालीन सहायता (Emergency SOS)' : 'Emergency SOS Helplines'}
              </h2>
              <p className="text-xs text-red-100">
                {language === 'hi'
                  ? 'सड़क दुर्घटना, चिकित्सा या पुलिस सहायता के लिए तुरंत कॉल करें'
                  : 'Instant one-tap assistance for accident, medical, police, or roadside emergencies'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Critical Instructions */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-800 space-y-1">
              <p className="font-semibold text-red-800">
                {language === 'hi'
                  ? 'कॉल करते समय शांत रहें और स्पष्ट रूप से बताएं:'
                  : 'When calling emergency services, clearly state:'}
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                <li>
                  {language === 'hi'
                    ? '1. आपका वर्तमान शहर, नजदीकी लैंडमार्क या मेट्रो पिलर नंबर'
                    : '1. Your exact location, city, nearest landmark, or metro pillar number'}
                </li>
                <li>
                  {language === 'hi'
                    ? '2. क्या कोई व्यक्ति गंभीर रूप से घायल है या सड़क पर फंसा है'
                    : '2. Number of injured persons and severity of bleeding / injury'}
                </li>
                <li>
                  {language === 'hi'
                    ? '3. दोनों गाड़ियों के प्रकार और दुर्घटना की स्थिति'
                    : '3. Vehicle types and whether there is traffic blockage or fire'}
                </li>
              </ul>
            </div>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyHotlines.map((hotline) => {
              const getIcon = () => {
                switch (hotline.category) {
                  case 'medical':
                    return <HeartPulse className="w-5 h-5 text-emerald-600" />;
                  case 'accident':
                  case 'highway':
                    return <Truck className="w-5 h-5 text-amber-600" />;
                  case 'dispute':
                    return <Scale className="w-5 h-5 text-blue-600" />;
                  default:
                    return <Phone className="w-5 h-5 text-red-600" />;
                }
              };

              return (
                <div
                  key={hotline.number}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getIcon()}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {hotline.category.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                        {hotline.number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900">
                      {language === 'hi' ? hotline.nameHi : hotline.nameEn}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {language === 'hi' ? hotline.descHi : hotline.descEn}
                    </p>
                  </div>

                  <a
                    href={`tel:${hotline.number}`}
                    className="mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-sm transition-colors active:scale-95"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>
                      {language === 'hi' ? `डायल करें ${hotline.number}` : `Call ${hotline.number}`}
                    </span>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Platform SOS reminder */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              {language === 'hi' ? 'प्लेटफॉर्म इन-ऐप इमरजेंसी बटन:' : 'Platform In-App Emergency Button:'}
            </p>
            <p>
              {language === 'hi'
                ? 'यदि आप सक्रिय ट्रिप या डिलीवरी पर हैं, तो तुरंत अपने स्विगी / जोमैटो / उबर ऐप में मौजूद लाल शील्ड/एसओएस बटन को भी दबाएं ताकि उनकी मेडिकल रिस्पांस टीम को भी अलर्ट मिल सके।'
                : 'If currently on an active delivery order or passenger ride, tap the Red Shield / SOS icon inside your Swiggy / Zomato / Uber partner app to trigger their dedicated safety command center and cashless insurance.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldAlert,
  Phone,
  AlertTriangle,
  Sun,
  CloudRain,
  Shield,
  UserX,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Truck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { safetyGuides, emergencyHotlines } from '../data/mockData';

interface SafetyCentreViewProps {
  onOpenSOS: () => void;
}

export const SafetyCentreView: React.FC<SafetyCentreViewProps> = ({ onOpenSOS }) => {
  const { language, t } = useLanguage();
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>('sg-accident');

  const getGuideIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-emerald-600" />;
      case 'UserX':
        return <UserX className="w-5 h-5 text-rose-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('safetyCentre')}
            </h1>
            <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              24x7 Road Protection
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'सड़क दुर्घटना, आपातकालीन सहायता, ट्रैफिक पुलिस चेकिंग में कानूनी अधिकार और भीषण मौसम सुरक्षा।'
              : 'Emergency trauma response, traffic police legal rights under CMVR, and extreme weather riding protocols.'}
          </p>
        </div>

        <button
          onClick={onOpenSOS}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 animate-pulse"
        >
          <Phone className="w-4 h-4 fill-current" />
          <span>{language === 'hi' ? 'आपातकालीन कॉल (SOS 112)' : 'Emergency SOS (112)'}</span>
        </button>
      </div>

      {/* Quick Direct Hotline Tap Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {emergencyHotlines.map((h) => (
          <a
            key={h.number}
            href={`tel:${h.number}`}
            className="bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-xl p-3 flex flex-col items-center text-center transition-all shadow-2xs group"
          >
            <span className="text-xs font-bold text-slate-500 group-hover:text-red-700">
              {h.number}
            </span>
            <span className="text-[11px] font-extrabold text-slate-900 group-hover:text-red-900 mt-0.5 line-clamp-1">
              {language === 'hi' ? h.nameHi.split(' ')[0] : h.nameEn.split(' ')[0]}
            </span>
            <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-0.5">
              <Phone className="w-2.5 h-2.5" />
              <span>{t('callNow')}</span>
            </span>
          </a>
        ))}
      </div>

      {/* Critical Legal Banner: DigiLocker & Key Snatching */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm sm:text-base">
            {language === 'hi'
              ? 'ट्रैफिक पुलिस चेकिंग: केंद्रीय मोटर वाहन नियम 139 (CMVR)'
              : 'Rule 139 CMVR: Official DigiLocker & Key Snatching Protections'}
          </h3>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {language === 'hi'
            ? 'सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH) के निर्देशानुसार डिजीलॉकर और mParivahan में प्रस्तुत डीएल और आरसी भौतिक दस्तावेजों के समान 100% कानूनी रूप से मान्य हैं। कोई भी पुलिसकर्मी चाबी नहीं छीन सकता। मौके पर जुर्माना केवल सब-इंस्पेक्टर (SI) स्तर के अधिकारी ही लगा सकते हैं।'
            : 'Under Ministry of Road Transport circulars, verified digital Driving Licences and Registration Certificates on DigiLocker / mParivahan are statutory equivalents of physical documents. Police cannot confiscate physical smartcards or seize ignition keys.'}
        </p>
      </div>

      {/* Interactive Safety Guides Accordion */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          {language === 'hi' ? 'महत्वपूर्ण सड़क व कार्यस्थल सुरक्षा गाइड' : 'Critical On-Road Safety Guidelines'}
        </h2>

        {safetyGuides.map((guide) => {
          const isExpanded = expandedGuideId === guide.id;
          const title = language === 'hi' ? guide.titleHi : guide.titleEn;
          const summary = language === 'hi' ? guide.summaryHi : guide.summaryEn;
          const points = language === 'hi' ? guide.pointsHi : guide.pointsEn;

          return (
            <div
              key={guide.id}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded ? 'border-blue-400 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-2xs'
              }`}
            >
              <div
                onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                className="p-5 cursor-pointer flex items-center justify-between gap-4 select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getGuideIcon(guide.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{summary}</p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 p-5 sm:p-6 bg-slate-50/60 rounded-b-2xl space-y-3 animate-fadeIn">
                  <div className="space-y-2.5">
                    {points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

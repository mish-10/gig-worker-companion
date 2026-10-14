import React, { useState } from 'react';
import {
  Landmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Search,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { governmentSchemes } from '../data/mockData';
import { GovernmentScheme } from '../types';

export const SchemesView: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('eshram');

  const categories = [
    { id: 'all', labelEn: 'All Schemes', labelHi: 'सभी योजनाएं' },
    { id: 'social_security', labelEn: 'Social Security', labelHi: 'सामाजिक सुरक्षा' },
    { id: 'insurance', labelEn: 'Insurance (₹2L)', labelHi: 'बीमा योजनाएं' },
    { id: 'health', labelEn: 'Health (₹5L)', labelHi: 'स्वास्थ्य सुरक्षा' },
    { id: 'credit', labelEn: 'Loans & Credit', labelHi: 'सस्ते लोन' },
    { id: 'state_board', labelEn: 'Gig Worker Acts', labelHi: 'गीग वर्कर बोर्ड' },
  ];

  const filteredSchemes = governmentSchemes.filter((scheme) => {
    const matchesCategory =
      selectedCategory === 'all' || scheme.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      scheme.titleEn.toLowerCase().includes(query) ||
      scheme.titleHi.toLowerCase().includes(query) ||
      scheme.descriptionEn.toLowerCase().includes(query) ||
      scheme.descriptionHi.toLowerCase().includes(query) ||
      scheme.tagEn.toLowerCase().includes(query) ||
      scheme.tagHi.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('schemes')}
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Official Indian Schemes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'असंगठित व गीग कामगारों के लिए भारत सरकार एवं राज्य सरकारों की प्रमाणित कल्याणकारी योजनाएं।'
              : 'Verified government social security, life/accident insurance, healthcare, and working capital credit for gig workers.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchSchemes')}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {language === 'hi' ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Trust & Source Notice */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {language === 'hi' ? '100% आधिकारिक सरकारी स्रोत:' : '100% Verified Official Sources:'}
          </span>
          <p className="text-emerald-900/90 mt-0.5">
            {language === 'hi'
              ? 'सभी विवरण श्रम एवं रोजगार मंत्रालय (MoLE), वित्तीय सेवा विभाग और राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) के आधिकारिक दिशानिर्देशों से संकलित हैं। आवेदन हमेशा दिए गए सरकारी पोर्टल लिंक पर ही करें।'
              : 'All information is sourced from the Ministry of Labour & Employment, Department of Financial Services, and National Health Authority. Never pay fees to private agents.'}
          </p>
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;
          const title = language === 'hi' ? scheme.titleHi : scheme.titleEn;
          const tag = language === 'hi' ? scheme.tagHi : scheme.tagEn;
          const coverage = language === 'hi' ? scheme.coverageHi : scheme.coverageEn;
          const desc = language === 'hi' ? scheme.descriptionHi : scheme.descriptionEn;
          const elig = language === 'hi' ? scheme.eligibilityHi : scheme.eligibilityEn;
          const benefits = language === 'hi' ? scheme.benefitsHi : scheme.benefitsEn;
          const procedure = language === 'hi' ? scheme.procedureHi : scheme.procedureEn;
          const docs = language === 'hi' ? scheme.documentsRequiredHi : scheme.documentsRequiredEn;

          return (
            <div
              key={scheme.id}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded
                  ? 'border-blue-400 shadow-md ring-1 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Card Title & Summary */}
              <div
                onClick={() => toggleExpand(scheme.id)}
                className="p-5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {tag}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {scheme.portalName}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
                  <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>
                      {language === 'hi' ? 'कवर / सहायता:' : 'Coverage:'} {coverage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-bold text-blue-600 hidden sm:inline">
                    {isExpanded
                      ? language === 'hi'
                        ? 'विवरण छिपाएं'
                        : 'Hide Details'
                      : language === 'hi'
                      ? 'पूरी जानकारी देखें'
                      : 'View Details'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 sm:p-6 space-y-6 bg-slate-50/50 rounded-b-2xl animate-fadeIn">
                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                    {desc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Benefits */}
                    <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-2.5">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t('keyBenefits')}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {benefits.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Eligibility */}
                    <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs space-y-2.5">
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span>{t('eligibility')}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {elig.map((e, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Application Steps & Required Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Steps */}
                    <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-indigo-600" />
                        <span>{t('howToApply')}</span>
                      </h4>
                      <div className="space-y-2 text-xs text-slate-700">
                        {procedure.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-slate-600" />
                        <span>{t('requiredDocs')}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {docs.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-400 font-bold">📄</span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* External official link button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-slate-500">
                      {language === 'hi'
                        ? 'सीधे भारत सरकार के आधिकारिक डोमेन पर सुरक्षित रूप से जाएं:'
                        : 'Direct access to verified Government of India domain:'}
                    </span>
                    <a
                      href={scheme.officialPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      <span>{t('visitOfficialPortal')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
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

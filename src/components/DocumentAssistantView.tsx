import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Calculator,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { workerDocuments } from '../data/mockData';

export const DocumentAssistantView: React.FC = () => {
  const { language, t } = useLanguage();
  const [expandedDocId, setExpandedDocId] = useState<string | null>('doc-pan-tds');

  // Interactive 1% TDS Refund Calculator state
  const [annualEarningsInput, setAnnualEarningsInput] = useState<string>('360000');
  const annualGross = parseFloat(annualEarningsInput) || 0;
  const estimatedTDS = Math.round(annualGross * 0.01);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('docTitle')}
            </h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
              RTO, Taxes & Verification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('docSubtitle')}</p>
        </div>
      </div>

      {/* Interactive 1% TDS Refund Calculator Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Calculator className="w-3.5 h-3.5" />
              <span>Section 194-O / 194C Gig Refund</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              {language === 'hi'
                ? 'आपका 1% काटा गया टीडीएस (TDS) पैसा वापस पाएं!'
                : 'Calculate Your 100% Refundable Gig Platform TDS'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'स्विगी, जोमैटो, उबर, ओला हर भुगतान पर 1% टीडीएस काटते हैं। यदि आपकी सालाना आमदनी ₹7 लाख से कम है, तो यह पूरा पैसा फ्री में आईटीआर भरकर वापस पाया जा सकता है।'
                : 'Aggregators deduct 1% TDS on every trip under Section 194-O. For gig workers earning under ₹7 Lakhs annually, this entire deducted money is fully refundable by filing a simple ITR-4!'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl w-full lg:w-80 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {language === 'hi' ? 'अनुमानित सालाना सकल कमाई (₹):' : 'Estimated Annual Gross Earnings (₹):'}
              </label>
              <input
                type="number"
                step="10000"
                min="0"
                value={annualEarningsInput}
                onChange={(e) => setAnnualEarningsInput(e.target.value)}
                className="w-full bg-white text-slate-900 font-bold px-3 py-2 rounded-lg text-sm outline-none"
              />
            </div>

            <div className="pt-2 border-t border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold">
                  {language === 'hi' ? 'वापस मिलने योग्य टीडीएस' : 'Refundable TDS Money'}
                </span>
                <span className="text-2xl font-extrabold text-emerald-300 font-mono">
                  ₹{estimatedTDS.toLocaleString('en-IN')}
                </span>
              </div>
              <a
                href="https://eportal.incometax.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>{language === 'hi' ? 'ITR भरें' : 'Claim'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {workerDocuments.map((doc) => {
          const isExpanded = expandedDocId === doc.id;
          const name = language === 'hi' ? doc.nameHi : doc.nameEn;
          const authority = language === 'hi' ? doc.authorityHi : doc.authorityEn;
          const purpose = language === 'hi' ? doc.purposeHi : doc.purposeEn;
          const whyNeeded = language === 'hi' ? doc.whyNeededHi : doc.whyNeededEn;
          const steps = language === 'hi' ? doc.stepsHi : doc.stepsEn;
          const mistakes = language === 'hi' ? doc.commonMistakesHi : doc.commonMistakesEn;

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded ? 'border-indigo-400 shadow-md ring-1 ring-indigo-100' : 'border-slate-200 shadow-2xs'
              }`}
            >
              <div
                onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                className="p-5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {authority}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{name}</h3>
                  <p className="text-xs text-slate-500">{purpose}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-bold text-indigo-600 hidden sm:inline">
                    {isExpanded
                      ? language === 'hi'
                        ? 'विवरण बंद करें'
                        : 'Close'
                      : language === 'hi'
                      ? 'प्रक्रिया देखें'
                      : 'View Steps'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 p-5 sm:p-6 bg-slate-50/50 rounded-b-2xl space-y-5 animate-fadeIn">
                  {/* Why Needed */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'hi' ? 'यह क्यों जरूरी है:' : 'Why It Is Essential:'}</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{whyNeeded}</p>
                  </div>

                  {/* Steps */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {language === 'hi' ? 'आवेदन व नवीनीकरण के चरण:' : 'Step-by-Step Procedure:'}
                    </h4>
                    <div className="space-y-2 text-xs text-slate-700">
                      {steps.map((st, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Mistakes */}
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>{language === 'hi' ? 'सामान्य गलतियां जिनसे बचें:' : 'Common Mistakes to Avoid:'}</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-950">
                      {mistakes.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">⚠️</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {doc.officialUrl && (
                    <div className="flex justify-end pt-1">
                      <a
                        href={doc.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        <span>{language === 'hi' ? 'आधिकारिक पोर्टल खोलें' : 'Open Official Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

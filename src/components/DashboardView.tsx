import React from 'react';
import {
  IndianRupee,
  Bot,
  Landmark,
  ShieldAlert,
  FileText,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Fuel,
  Clock,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { EarningsEntry } from '../types';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  earnings: EarningsEntry[];
  onNavigate: (tab: NavTab) => void;
  onResetDemo: () => void;
  onOpenNewShiftModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  earnings,
  onNavigate,
  onResetDemo,
  onOpenNewShiftModal,
}) => {
  const { language, t } = useLanguage();

  // Metrics calculations
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayEntry = earnings.find((e) => e.date === todayDateStr) || earnings[0]; // fallback to latest

  const totalWeeklyNet = earnings.reduce((acc, curr) => acc + curr.netEarnings, 0);
  const totalWeeklyGross = earnings.reduce(
    (acc, curr) => acc + curr.grossEarnings + curr.incentives + curr.tips,
    0
  );
  const totalFuelExpenses = earnings.reduce((acc, curr) => acc + curr.fuelExpense, 0);
  const totalHours = earnings.reduce((acc, curr) => acc + curr.hoursWorked, 0);
  const totalTrips = earnings.reduce((acc, curr) => acc + curr.tripsCount, 0);
  const avgHourlyRate = totalHours > 0 ? Math.round(totalWeeklyNet / totalHours) : 0;

  const hasDemoData = earnings.some((e) => e.isDemo);

  const featureCards: {
    id: NavTab;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    icon: React.ElementType;
    badgeEn: string;
    badgeHi: string;
    gradient: string;
    border: string;
  }[] = [
    {
      id: 'companion',
      titleEn: 'AI Companion',
      titleHi: 'AI गीग साथी',
      descEn:
        'Ask real Gemini 3.8 Flash about ID suspension, e-Shram rights, insurance claims, or 1% TDS refund.',
      descHi:
        'आईडी ब्लॉक, ई-श्रम लाभ, एक्सीडेंट क्लेम या टीडीएस रिफंड पर सीधे जेमिनी AI से सलाह लें।',
      icon: Bot,
      badgeEn: 'Live Gemini AI',
      badgeHi: 'लाइव जेमिनी AI',
      gradient: 'from-blue-600 to-indigo-600',
      border: 'border-blue-200 hover:border-blue-400',
    },
    {
      id: 'earnings',
      titleEn: 'Earnings Tracker',
      titleHi: 'कमाई व खर्च ट्रैकर',
      descEn:
        'Record gross fares, target incentives, fuel costs, and deductions to know real hourly net pay.',
      descHi:
        'किराया, इंसेंटिव, पेट्रोल खर्च और कटौतियों का पूरा हिसाब रखें और वास्तविक बचत देखें।',
      icon: IndianRupee,
      badgeEn: 'Profit Calculator',
      badgeHi: 'शुद्ध बचत कैलकुलेटर',
      gradient: 'from-emerald-600 to-teal-600',
      border: 'border-emerald-200 hover:border-emerald-400',
    },
    {
      id: 'schemes',
      titleEn: 'Government Schemes',
      titleHi: 'सरकारी कल्याणकारी योजनाएं',
      descEn:
        'Explore e-Shram, PMSBY ₹2L accident insurance, PM-JAY ₹5L health cover, and PM SVANidhi loans.',
      descHi:
        'ई-श्रम कार्ड, ₹2 लाख का PMSBY दुर्घटना बीमा, ₹5 लाख आयुष्मान भारत और स्वनिधि लोन की जानकारी।',
      icon: Landmark,
      badgeEn: 'Verified Portals',
      badgeHi: 'आधिकारिक पोर्टल',
      gradient: 'from-sky-600 to-blue-700',
      border: 'border-sky-200 hover:border-sky-400',
    },
    {
      id: 'safety',
      titleEn: 'Safety & Emergency Centre',
      titleHi: 'सुरक्षा व आपातकालीन केंद्र',
      descEn:
        'Immediate post-accident SOP, 112/108 SOS dialers, traffic police rights, and extreme heatwave guide.',
      descHi:
        'सड़क दुर्घटना एसओपी, 112/108 डायलर्स, ट्रैफिक पुलिस चेकिंग नियम और लू से बचाव के निर्देश।',
      icon: ShieldAlert,
      badgeEn: 'Road Protocols',
      badgeHi: 'सड़क सुरक्षा नियम',
      gradient: 'from-amber-600 to-orange-600',
      border: 'border-amber-200 hover:border-amber-400',
    },
    {
      id: 'documents',
      titleEn: 'Document Assistant',
      titleHi: 'दस्तावेज मार्गदर्शक',
      descEn:
        'Step-by-step guides for Commercial DL, Insurance, DigiLocker validity, and 1% TDS recovery.',
      descHi:
        'ड्राइविंग लाइसेंस, कॉमर्शियल बीमा, डिजीलॉकर वैधता और 1% टीडीएस रिफंड पाने का सरल गाइड।',
      icon: FileText,
      badgeEn: 'RTO & Tax Guide',
      badgeHi: 'आरटीओ व टैक्स गाइड',
      gradient: 'from-purple-600 to-indigo-700',
      border: 'border-purple-200 hover:border-purple-400',
    },
    {
      id: 'complaints',
      titleEn: 'Dispute Complaint Generator',
      titleHi: 'विवाद शिकायत जेनरेटर',
      descEn:
        'Draft formal, legal-grade letters for delayed payouts, unfair penalties, or arbitrary account blocks.',
      descHi:
        'अटके हुए भुगतान, अनुचित जुर्माने या मनमाने ढंग से आईडी बंद होने पर कानूनी शिकायत पत्र बनाएं।',
      icon: AlertCircle,
      badgeEn: 'Legal Grade Drafts',
      badgeHi: 'औपचारिक शिकायत पत्र',
      gradient: 'from-rose-600 to-red-600',
      border: 'border-rose-200 hover:border-rose-400',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-spin" />
              <span>
                {language === 'hi'
                  ? 'भारत के गीग व प्लेटफॉर्म कामगारों का भरोसेमंद साथी'
                  : "India's Dedicated Digital Ally for Gig & Delivery Workers"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {language === 'hi' ? 'नमस्ते पार्टनर, आज का दिन सुरक्षित रहे!' : 'Hello Partner, Ride & Drive Safe!'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {language === 'hi'
                ? 'अपनी वास्तविक कमाई का हिसाब रखें, जेमिनी AI से तत्काल कानूनी व तकनीकी सलाह पाएं, और सरकारी योजनाओं का पूरा लाभ उठाएं।'
                : 'Track true net earnings, get real-time legal & platform advice powered by Gemini AI, and claim government welfare protections.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onNavigate('companion')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span>{language === 'hi' ? 'AI से सवाल पूछें' : 'Ask AI Companion'}</span>
            </button>
            <button
              onClick={onOpenNewShiftModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs transition-colors"
            >
              <IndianRupee className="w-4 h-4" />
              <span>{language === 'hi' ? 'शिफ्ट एंट्री जोड़ें' : 'Log New Shift'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo Data Notice Banner */}
      {hasDemoData && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                  {t('demoDataBadge')}
                </span>
                <span className="text-xs text-amber-800 font-medium">
                  {language === 'hi' ? 'नमूना शिफ्ट डेटा सक्रिय है' : 'Realistic Indian gig shift data'}
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-0.5">{t('demoDataExpl')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenNewShiftModal}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              {language === 'hi' ? '+ मेरी एंट्री जोड़ें' : '+ Add Real Shift'}
            </button>
            <button
              onClick={onResetDemo}
              className="px-3 py-1.5 bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Net */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('todayEarnings')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{(todayEntry?.netEarnings || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {todayEntry?.platform || 'Swiggy'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {language === 'hi' ? 'सकल कमाई:' : 'Gross:'} ₹
              {(
                (todayEntry?.grossEarnings || 0) +
                (todayEntry?.incentives || 0) +
                (todayEntry?.tips || 0)
              ).toLocaleString('en-IN')}
            </span>
            <span className="text-rose-600 font-medium">
              {language === 'hi' ? 'पेट्रोल/खर्च:' : 'Fuel:'} -₹{todayEntry?.fuelExpense || 0}
            </span>
          </div>
        </div>

        {/* Weekly Net */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('thisWeekEarnings')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{totalWeeklyNet.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-medium text-slate-500">({earnings.length} shifts)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {language === 'hi' ? 'कुल सकल:' : 'Total Gross:'} ₹{totalWeeklyGross.toLocaleString('en-IN')}
            </span>
            <span className="text-blue-600 font-medium">
              {language === 'hi' ? 'बचत दर:' : 'Margin:'}{' '}
              {totalWeeklyGross > 0 ? Math.round((totalWeeklyNet / totalWeeklyGross) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Avg Net Per Hour */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('avgHourlyRate')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{avgHourlyRate}
            </span>
            <span className="text-xs text-slate-500">{language === 'hi' ? '/ घंटा' : '/ hour'}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {language === 'hi' ? 'कुल समय:' : 'Total Hours:'} {totalHours.toFixed(1)} hrs
            </span>
            <span className="text-purple-700 font-semibold">
              {avgHourlyRate > 150 ? 'Good Pace' : 'Moderate'}
            </span>
          </div>
        </div>

        {/* Fuel & Total Trips */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'hi' ? 'ईंधन व ट्रिप्स' : 'Fuel & Trips'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalTrips}</span>
            <span className="text-xs text-slate-500">{language === 'hi' ? 'ट्रिप्स' : 'trips / orders'}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {language === 'hi' ? 'कुल पेट्रोल खर्च:' : 'Total Fuel:'} ₹
              {totalFuelExpenses.toLocaleString('en-IN')}
            </span>
            <span className="text-amber-700 font-medium">
              ~₹{totalTrips > 0 ? Math.round(totalFuelExpenses / totalTrips) : 0}/trip
            </span>
          </div>
        </div>
      </div>

      {/* Safety Alert of the Day */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
              {t('safetyTipTitle')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {language === 'hi'
              ? 'डिजिटल लॉकर नियम 139: ट्रैफिक पुलिस आपकी भौतिक आरसी या डीएल मांगने के लिए बाध्य नहीं कर सकती यदि आपने डिजीलॉकर या mParivahan से सत्यापित प्रति दिखाई है।'
              : 'Rule 139 CMVR Legal Protection: Traffic police cannot demand physical DL/RC if presented via DigiLocker or mParivahan. Never let anyone arbitrarily snatch vehicle keys.'}
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigate('safety')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span>{language === 'hi' ? 'सुरक्षा नियम व अधिकार देखें' : 'View Safety Rules & Rights'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('quickActions')}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'सभी उपयोगी सुविधाएं एक जगह उपलब्ध हैं'
                : 'Direct access to all specialized gig worker support modules'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`bg-white rounded-2xl p-5 border ${card.border} shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-slate-200 transition-colors">
                      {language === 'hi' ? card.badgeHi : card.badgeEn}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'hi' ? card.titleHi : card.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {language === 'hi' ? card.descHi : card.descEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>{language === 'hi' ? 'खोलें' : 'Open Module'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Shift Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t('recentShifts')}</h3>
          </div>
          <button
            onClick={() => onNavigate('earnings')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'पूरा ट्रैकर देखें' : 'View Full Tracker'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">{t('date')}</th>
                <th className="px-5 py-3">{t('platform')}</th>
                <th className="px-5 py-3">{t('grossFare')}</th>
                <th className="px-5 py-3">{t('fuelCost')}</th>
                <th className="px-5 py-3">{t('netTakeHome')}</th>
                <th className="px-5 py-3">{t('hours')} / {t('trips')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {earnings.slice(0, 5).map((entry) => {
                const totalGross = entry.grossEarnings + entry.incentives + entry.tips;
                return (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {entry.date}
                      {entry.isDemo && (
                        <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
                        {entry.platform}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      ₹{totalGross.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-rose-600 font-medium">
                      -₹{entry.fuelExpense.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-emerald-600 text-sm">
                      ₹{entry.netEarnings.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {entry.hoursWorked} hrs • {entry.tripsCount} trips
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

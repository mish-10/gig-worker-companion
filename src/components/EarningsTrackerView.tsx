import React, { useState } from 'react';
import {
  IndianRupee,
  Plus,
  TrendingUp,
  Fuel,
  Wrench,
  Smartphone,
  MinusCircle,
  Filter,
  RotateCcw,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  BarChart3,
  Download,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { EarningsEntry, Platform } from '../types';

interface EarningsTrackerViewProps {
  earnings: EarningsEntry[];
  onAddEntry: (entry: Omit<EarningsEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const PLATFORMS: Platform[] = [
  'Swiggy',
  'Zomato',
  'Zepto',
  'Blinkit',
  'Uber',
  'Ola',
  'Rapido',
  'Porter',
  'Urban Company',
  'Amazon Flex',
  'Other',
];

export const EarningsTrackerView: React.FC<EarningsTrackerViewProps> = ({
  earnings,
  onAddEntry,
  onDeleteEntry,
  onResetDemo,
  onClearAll,
  isModalOpen,
  setIsModalOpen,
}) => {
  const { language, t } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');

  // Form state
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState<Platform>('Swiggy');
  const [grossEarnings, setGrossEarnings] = useState<string>('1200');
  const [incentives, setIncentives] = useState<string>('250');
  const [tips, setTips] = useState<string>('50');
  const [fuelExpense, setFuelExpense] = useState<string>('300');
  const [maintenanceExpense, setMaintenanceExpense] = useState<string>('30');
  const [foodAndDataExpense, setFoodAndDataExpense] = useState<string>('80');
  const [deductions, setDeductions] = useState<string>('15');
  const [hoursWorked, setHoursWorked] = useState<string>('8');
  const [tripsCount, setTripsCount] = useState<string>('15');
  const [notes, setNotes] = useState<string>('');

  // Live calculation for form preview
  const numGross = parseFloat(grossEarnings) || 0;
  const numIncentives = parseFloat(incentives) || 0;
  const numTips = parseFloat(tips) || 0;
  const numFuel = parseFloat(fuelExpense) || 0;
  const numMaint = parseFloat(maintenanceExpense) || 0;
  const numFoodData = parseFloat(foodAndDataExpense) || 0;
  const numDeductions = parseFloat(deductions) || 0;

  const previewNet = numGross + numIncentives + numTips - (numFuel + numMaint + numFoodData + numDeductions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry({
      date,
      platform,
      grossEarnings: numGross,
      incentives: numIncentives,
      tips: numTips,
      fuelExpense: numFuel,
      maintenanceExpense: numMaint,
      foodAndDataExpense: numFoodData,
      deductions: numDeductions,
      netEarnings: previewNet,
      hoursWorked: parseFloat(hoursWorked) || 0,
      tripsCount: parseInt(tripsCount, 10) || 0,
      notes,
      isDemo: false,
    });
    setIsModalOpen(false);
    // Reset defaults for next time
    setNotes('');
  };

  // Filtered entries
  const filteredEntries =
    selectedPlatform === 'ALL'
      ? earnings
      : earnings.filter((e) => e.platform === selectedPlatform);

  // Overall totals for filtered set
  const totalNet = filteredEntries.reduce((s, e) => s + e.netEarnings, 0);
  const totalGross = filteredEntries.reduce(
    (s, e) => s + e.grossEarnings + e.incentives + e.tips,
    0
  );
  const totalFuel = filteredEntries.reduce((s, e) => s + e.fuelExpense, 0);
  const totalDeductions = filteredEntries.reduce((s, e) => s + e.deductions, 0);
  const totalHours = filteredEntries.reduce((s, e) => s + e.hoursWorked, 0);
  const totalTrips = filteredEntries.reduce((s, e) => s + e.tripsCount, 0);
  const avgHourly = totalHours > 0 ? Math.round(totalNet / totalHours) : 0;

  // Max for bar chart scaling
  const maxGross = Math.max(...filteredEntries.map((e) => e.grossEarnings + e.incentives + e.tips), 100);

  const exportCSV = () => {
    const headers = 'Date,Platform,Gross,Incentives,Tips,Fuel,Maintenance,FoodData,Deductions,NetTakeHome,Hours,Trips,Notes\n';
    const rows = filteredEntries
      .map(
        (e) =>
          `"${e.date}","${e.platform}",${e.grossEarnings},${e.incentives},${e.tips},${e.fuelExpense},${e.maintenanceExpense},${e.foodAndDataExpense},${e.deductions},${e.netEarnings},${e.hoursWorked},${e.tripsCount},"${e.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gig_earnings_${selectedPlatform}_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('earningsTracker')}
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Real Net Profit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'सकल किराया, इंसेंटिव, पेट्रोल खर्च, भोजन व टीडीएस कटौती का सटीक हिसाब रखें।'
              : 'Calculate actual in-pocket earnings after fuel, bike maintenance, food, and platform TDS.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addShift')}</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
            title="Download CSV report"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={onResetDemo}
            className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
            title="Reset Sample Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hi' ? 'नमूना डेटा' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Overview Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">{t('filterPlatform')}:</span>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-xs font-semibold rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="ALL">{t('allPlatforms')}</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span>
            {language === 'hi' ? 'दिखाए जा रहे रिकॉर्ड्स:' : 'Showing records:'}{' '}
            <strong className="text-slate-800">{filteredEntries.length}</strong>
          </span>
          {earnings.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t('clearAll')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('netTakeHome')}
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 block">
            ₹{totalNet.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {language === 'hi' ? 'शुद्ध इन-हैंड बचत' : 'Actual disposable pay'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('grossFare')} + Tips
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 block">
            ₹{totalGross.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {language === 'hi' ? 'कंपनी द्वारा क्रेडिट सकल' : 'Pre-expense billed amount'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('fuelCost')}
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-1 block">
            -₹{totalFuel.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {totalGross > 0 ? Math.round((totalFuel / totalGross) * 100) : 0}% of gross earnings
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('avgHourlyRate')}
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1 block">
            ₹{avgHourly}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Across {totalHours.toFixed(1)} total shift hours
          </span>
        </div>
      </div>

      {/* Visual Chart: Daily & Weekly Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {language === 'hi'
                ? 'दैनिक कमाई व खर्च तुलना (Weekly Performance)'
                : 'Daily Shift Comparison: Net Take-Home vs Expenses'}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-600 font-medium">Net Take-Home</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-400" />
              <span className="text-slate-600 font-medium">Fuel & Expenses</span>
            </div>
          </div>
        </div>

        {/* Bar visual list */}
        <div className="space-y-3 pt-2">
          {filteredEntries.map((item) => {
            const shiftTotalGross = item.grossEarnings + item.incentives + item.tips;
            const shiftExpenses = item.fuelExpense + item.maintenanceExpense + item.foodAndDataExpense + item.deductions;
            const netPercent = Math.min(100, Math.round((item.netEarnings / maxGross) * 100));
            const expensePercent = Math.min(100, Math.round((shiftExpenses / maxGross) * 100));

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500">{item.date}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 text-[10px]">
                      {item.platform}
                    </span>
                    {item.isDemo && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                        DEMO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-700 font-bold">₹{item.netEarnings}</span>
                    <span className="text-slate-400 text-[10px]">(Gross ₹{shiftTotalGross})</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${netPercent}%` }}
                    className="bg-emerald-500 h-full rounded-l-full transition-all"
                    title={`Net Take-Home: ₹${item.netEarnings}`}
                  />
                  <div
                    style={{ width: `${expensePercent}%` }}
                    className="bg-rose-400 h-full rounded-r-full transition-all"
                    title={`Fuel & Expenses: ₹${shiftExpenses}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shifts Detail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {language === 'hi' ? 'विस्तृत शिफ्ट एंट्री रिकॉर्ड' : 'Shift Log Entries'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {filteredEntries.length} entries recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">{t('date')}</th>
                <th className="px-4 py-3">{t('platform')}</th>
                <th className="px-4 py-3">Gross & Bonus</th>
                <th className="px-4 py-3">Expenses (Fuel/Repairs)</th>
                <th className="px-4 py-3">{t('deductions')}</th>
                <th className="px-4 py-3">{t('netTakeHome')}</th>
                <th className="px-4 py-3">{t('hours')} / Trips</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => {
                const shiftGross = entry.grossEarnings + entry.incentives + entry.tips;
                const shiftExpenses = entry.fuelExpense + entry.maintenanceExpense + entry.foodAndDataExpense;

                return (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {entry.date}
                      {entry.isDemo && (
                        <span className="ml-1 text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-700 whitespace-nowrap">
                      {entry.platform}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      <div>₹{shiftGross.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400">
                        Fare: ₹{entry.grossEarnings} | Inc: ₹{entry.incentives}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-rose-600">
                      <div>-₹{shiftExpenses.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400">
                        Fuel: ₹{entry.fuelExpense} | Maint: ₹{entry.maintenanceExpense}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-amber-700 font-medium">
                      -₹{entry.deductions}
                      <span className="text-[10px] text-slate-400 block">TDS/Penal</span>
                    </td>
                    <td className="px-4 py-3 font-extrabold text-emerald-600 text-sm whitespace-nowrap">
                      ₹{entry.netEarnings.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {entry.hoursWorked} hrs • {entry.tripsCount} trips
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Shift */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t('addShift')}</h3>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'आज की शिफ्ट की वास्तविक कमाई और खर्च दर्ज करें'
                    : 'Log real shift numbers to calculate actual take-home profit'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('date')}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('platform')}
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Incomes */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-3">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  1. Income & Bonuses (₹)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                      Base Fare (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={grossEarnings}
                      onChange={(e) => setGrossEarnings(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                      Incentives (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={incentives}
                      onChange={(e) => setIncentives(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                      Tips (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tips}
                      onChange={(e) => setTips(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-xl space-y-3">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                  2. Expenses & Deductions (₹)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                      Fuel/EV (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={fuelExpense}
                      onChange={(e) => setFuelExpense(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                      Repairs (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maintenanceExpense}
                      onChange={(e) => setMaintenanceExpense(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                      Food/Data (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={foodAndDataExpense}
                      onChange={(e) => setFoodAndDataExpense(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                      TDS / Penalty (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Effort & Trips */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('hours')} Worked
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('trips')} Completed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tripsCount}
                    onChange={(e) => setTripsCount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Shift Notes (Rain surge, traffic delay, area)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Heavy rain surge bonus in South Zone"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                    Calculated Take-Home Net
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    ₹{previewNet.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right text-xs text-slate-300 font-mono">
                  <span>Gross: ₹{numGross + numIncentives + numTips}</span>
                  <span className="text-rose-400 block">
                    Exp: -₹{numFuel + numMaint + numFoodData + numDeductions}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-100"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  {t('saveEntry')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  IndianRupee,
  Landmark,
  ShieldAlert,
  FileText,
  AlertCircle,
  Menu,
  X,
  PhoneCall,
  Languages,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type NavTab =
  | 'dashboard'
  | 'companion'
  | 'earnings'
  | 'schemes'
  | 'safety'
  | 'documents'
  | 'complaints';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSOS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSOS }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; labelKey: string; icon: React.ElementType }[] = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'companion', labelKey: 'aiCompanion', icon: Bot },
    { id: 'earnings', labelKey: 'earningsTracker', icon: IndianRupee },
    { id: 'schemes', labelKey: 'schemes', icon: Landmark },
    { id: 'safety', labelKey: 'safetyCentre', icon: ShieldAlert },
    { id: 'documents', labelKey: 'documentAssistant', icon: FileText },
    { id: 'complaints', labelKey: 'complaintGenerator', icon: AlertCircle },
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleTabClick('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                    Gig Worker
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Companion
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                  {language === 'hi' ? 'गीग वर्कर साथी • भारत' : 'India Gig Partner Hub'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: Language & SOS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 hidden sm:inline" />
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === 'en'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === 'hi'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="Switch to Hindi"
                >
                  हिन्दी
                </button>
              </div>

              {/* SOS Emergency button */}
              <button
                onClick={onOpenSOS}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-red-500/30 transition-transform active:scale-95 animate-pulse"
                title="Emergency Helplines"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SOS</span>
                <span className="text-[10px] bg-red-800 px-1.5 py-0.2 rounded font-mono">112</span>
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Quick Bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </button>
        <button
          onClick={() => handleTabClick('companion')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-colors ${
            activeTab === 'companion' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span>{language === 'hi' ? 'AI साथी' : 'AI Help'}</span>
        </button>
        <button
          onClick={() => handleTabClick('earnings')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-colors ${
            activeTab === 'earnings' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <IndianRupee className="w-5 h-5" />
          <span>{language === 'hi' ? 'कमाई' : 'Earnings'}</span>
        </button>
        <button
          onClick={() => handleTabClick('safety')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-colors ${
            activeTab === 'safety' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span>{language === 'hi' ? 'सुरक्षा' : 'Safety'}</span>
        </button>
        <button
          onClick={() => handleTabClick('complaints')}
          className={`flex flex-col items-center p-1.5 text-[10px] font-medium transition-colors ${
            activeTab === 'complaints' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          <span>{language === 'hi' ? 'शिकायत' : 'Dispute'}</span>
        </button>
      </div>
    </>
  );
};

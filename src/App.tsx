/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AICompanionView } from './components/AICompanionView';
import { EarningsTrackerView } from './components/EarningsTrackerView';
import { SchemesView } from './components/SchemesView';
import { SafetyCentreView } from './components/SafetyCentreView';
import { DocumentAssistantView } from './components/DocumentAssistantView';
import { ComplaintGeneratorView } from './components/ComplaintGeneratorView';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { initialEarnings } from './data/mockData';
import { EarningsEntry } from './types';
import { Shield, Heart, ExternalLink, Phone } from 'lucide-react';

function AppContent() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false);

  // Earnings state with LocalStorage persistence
  const [earnings, setEarnings] = useState<EarningsEntry[]>(() => {
    const saved = localStorage.getItem('gig_companion_earnings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved earnings:', e);
      }
    }
    return initialEarnings;
  });

  useEffect(() => {
    localStorage.setItem('gig_companion_earnings', JSON.stringify(earnings));
  }, [earnings]);

  const handleAddEntry = (newEntryData: Omit<EarningsEntry, 'id'>) => {
    const newEntry: EarningsEntry = {
      ...newEntryData,
      id: 'shift-' + Date.now(),
    };
    setEarnings((prev) => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEarnings((prev) => prev.filter((e) => e.id !== id));
  };

  const handleResetDemo = () => {
    setEarnings(initialEarnings);
    localStorage.setItem('gig_companion_earnings', JSON.stringify(initialEarnings));
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        language === 'hi'
          ? 'क्या आप सभी शिफ्ट एंट्रीज हटाना चाहते हैं?'
          : 'Are you sure you want to clear all shift records?'
      )
    ) {
      setEarnings([]);
      localStorage.removeItem('gig_companion_earnings');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            earnings={earnings}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetDemo={handleResetDemo}
            onOpenNewShiftModal={() => {
              setActiveTab('earnings');
              setIsNewShiftModalOpen(true);
            }}
          />
        )}

        {activeTab === 'companion' && <AICompanionView />}

        {activeTab === 'earnings' && (
          <EarningsTrackerView
            earnings={earnings}
            onAddEntry={handleAddEntry}
            onDeleteEntry={handleDeleteEntry}
            onResetDemo={handleResetDemo}
            onClearAll={handleClearAll}
            isModalOpen={isNewShiftModalOpen}
            setIsModalOpen={setIsNewShiftModalOpen}
          />
        )}

        {activeTab === 'schemes' && <SchemesView />}

        {activeTab === 'safety' && (
          <SafetyCentreView onOpenSOS={() => setIsSOSOpen(true)} />
        )}

        {activeTab === 'documents' && <DocumentAssistantView />}

        {activeTab === 'complaints' && <ComplaintGeneratorView />}
      </main>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">Gig Worker Companion (गीग वर्कर साथी)</span>
            <span className="text-slate-400">• Dedicated to India's Platform Workforce</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsSOSOpen(true)}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>National SOS: 112 / 108</span>
            </button>
            <a
              href="https://eshram.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <span>e-Shram Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <span>NCH (1915)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

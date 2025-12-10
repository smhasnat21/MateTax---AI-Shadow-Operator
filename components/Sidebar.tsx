import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onNewChat: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onNewChat, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-brand-dark/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-dark text-brand-beige transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex flex-col shadow-xl
      `}>
        
        {/* Header */}
        <div className="p-6 border-b border-brand-medium/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-beige rounded-full flex items-center justify-center text-brand-dark font-bold text-xl shadow-inner">
              M
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">MateTax</h1>
              <p className="text-xs text-brand-pale opacity-80 tracking-wider">SHADOW OPERATOR</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => {
              onChangeView(AppView.DASHBOARD);
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium
              ${currentView === AppView.DASHBOARD 
                ? 'bg-brand-medium text-brand-beige shadow-md' 
                : 'hover:bg-brand-medium/20 text-brand-beige/80'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Command Center
          </button>

          <button 
            onClick={() => {
              onNewChat();
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium mt-4 border border-brand-pale/20 hover:bg-brand-medium/20 text-brand-beige`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Operation
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-6 border-t border-brand-medium/30 text-xs text-brand-pale/60">
        {/*<p className="font-mono mb-1">SYSTEM: ONLINE</p>*/}
          <p>ADMIN: HASNAT</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
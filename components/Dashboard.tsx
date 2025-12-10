import React from 'react';
import { ICONS, APP_NAME, APP_TAGLINE } from '../constants';
import { QuickAction } from '../types';

interface DashboardProps {
  onQuickAction: (action: QuickAction) => void;
}

const ACTIONS: QuickAction[] = [
  {
    id: 'triage',
    title: 'TaxDebtTriage Ops',
    description: 'Lead flows, triage protocols, and follow-up.',
    icon: ICONS.Shield,
    promptPrefix: 'Review the TaxDebtTriage.com new lead workflow and suggest optimization for '
  },
  {
    id: 'ghl',
    title: 'GHL Architecture',
    description: 'Workflows, triggers, pipelines, and snapshots.',
    icon: ICONS.GHL,
    promptPrefix: 'I need help with a GoHighLevel workflow for '
  },
  {
    id: 'funnel',
    title: 'Funnel Strategy',
    description: 'Landing pages, conversion optimization, and UTMs.',
    icon: ICONS.Funnel,
    promptPrefix: 'Analyze my funnel strategy for '
  },
  {
    id: 'ai',
    title: 'AI Automation',
    description: 'Zapier/Make integrations and SOP creation.',
    icon: ICONS.AI,
    promptPrefix: 'Design an automation workflow to '
  },
  {
    id: 'content',
    title: 'Content Systems',
    description: 'Video editing workflows and content calendars.',
    icon: ICONS.Content,
    promptPrefix: 'Help me create a system for repurposing content related to '
  },
  {
    id: 'analytics',
    title: 'Analytics & KPIs',
    description: 'Dashboards, reporting, and data tracking.',
    icon: ICONS.Analytics,
    promptPrefix: 'I need a KPI dashboard to track '
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onQuickAction }) => {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-12 bg-brand-beige">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-3 tracking-tight">
            Welcome back, Detective.
          </h2>
          <p className="text-xl text-brand-medium/90 font-medium font-mono">
            {APP_TAGLINE}
          </p>
          <p className="mt-4 text-brand-text/70 max-w-2xl">
            Systems are operational. Select a module below to initiate a Shadow Operation or begin a new inquiry.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => onQuickAction(action)}
              className="group bg-brand-pale/30 border border-brand-medium/20 hover:border-brand-medium hover:bg-brand-pale/50 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-dark text-brand-beige flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">{action.title}</h3>
              <p className="text-brand-text/80 text-sm leading-relaxed">
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* Status Bar */}
        <div className="mt-12 bg-brand-dark/5 rounded-lg p-4 flex items-center justify-between border border-brand-dark/10">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-mono font-bold text-brand-dark uppercase">System Status: Optimal</span>
          </div>
          <span className="text-xs font-mono text-brand-dark/60">Ready for Deployment</span>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { ViewState } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle, 
  ArrowLeft, 
  Share2, 
  Download,
  Edit3
} from 'lucide-react';

interface ReportProps {
  onBack: () => void;
}

// Mock Data for the chart
const DATA = [
  { month: 'Now', manual: 5000, automated: 5000 },
  { month: 'M1', manual: 5000, automated: 4200 },
  { month: 'M2', manual: 5000, automated: 3000 },
  { month: 'M3', manual: 5000, automated: 1500 },
  { month: 'M4', manual: 5000, automated: 800 },
  { month: 'M5', manual: 5000, automated: 800 },
  { month: 'M6', manual: 5000, automated: 800 },
];

export const ReportView: React.FC<ReportProps> = ({ onBack }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-surfaceHighlight text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Acme Corp Analysis</h1>
            <p className="text-success font-medium">Estimated Annual Savings: $48,200</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-full border border-gray-700 text-gray-300 text-sm hover:text-white hover:border-gray-500 flex items-center gap-2">
            <Edit3 size={14} /> Edit
          </button>
          <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primaryDark flex items-center gap-2 shadow-lg shadow-primary/20">
            <Share2 size={16} /> Share Proposal
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-surfaceHighlight">
          <h3 className="text-lg font-semibold text-white mb-6">Cost Projection (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="manual" stroke="#ef4444" fillOpacity={1} fill="url(#colorManual)" name="Manual Cost" />
                <Area type="monotone" dataKey="automated" stroke="#6366f1" fillOpacity={1} fill="url(#colorAuto)" name="Automated Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-6 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-3 h-3 rounded-full bg-red-500"></div> Current Trajectory
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-3 h-3 rounded-full bg-primary"></div> With Automation
            </div>
          </div>
        </div>

        {/* ROI Stats */}
        <div className="space-y-6">
           <div className="bg-surface p-6 rounded-2xl border border-surfaceHighlight">
             <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">ROI Multiplier</h3>
             <div className="text-4xl font-bold text-white mb-1">5.2x</div>
             <p className="text-sm text-gray-500">Return on investment in first 12 months.</p>
           </div>
           
           <div className="bg-surface p-6 rounded-2xl border border-surfaceHighlight">
             <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Hours Saved</h3>
             <div className="text-4xl font-bold text-white mb-1">24<span className="text-lg text-gray-500 font-normal">/wk</span></div>
             <p className="text-sm text-gray-500">Equivalent to 0.6 Full-time employees.</p>
           </div>
        </div>

        {/* Opportunities List */}
        <div className="lg:col-span-3">
          <h3 className="text-xl font-bold text-white mb-4">Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OpportunityCard 
              title="Automated Lead Capture" 
              desc="Sync Webflow forms directly to Salesforce with enrichment via Clearbit."
              impact="High"
              savings="$1,200/mo"
            />
            <OpportunityCard 
              title="Invoice Generation" 
              desc="Trigger QuickBooks invoice creation upon Deal Won in HubSpot."
              impact="Medium"
              savings="$850/mo"
            />
            <OpportunityCard 
              title="Customer Onboarding" 
              desc="Auto-create Notion client portals and Slack channels."
              impact="Medium"
              savings="$600/mo"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const OpportunityCard = ({ title, desc, impact, savings }: any) => (
  <div className="bg-surfaceHighlight/50 p-5 rounded-xl border border-transparent hover:border-primary/30 transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-white group-hover:text-primary transition-colors">{title}</h4>
      <span className={`text-xs px-2 py-1 rounded-md ${impact === 'High' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
        {impact} Impact
      </span>
    </div>
    <p className="text-sm text-gray-400 mb-4 h-10 line-clamp-2">{desc}</p>
    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
        <CheckCircle size={14} /> {savings}
      </div>
      <button className="text-xs bg-white text-black px-3 py-1.5 rounded-md font-medium hover:bg-gray-200">
        Add to Quote
      </button>
    </div>
  </div>
);
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { VideoLinkData } from '../types';
import { MousePointer2, Tag, Layers, ExternalLink } from 'lucide-react';

interface DashboardProps {
  data: VideoLinkData[];
}

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalLinks: data.length,
      uniqueCampaigns: new Set(data.map(d => d.params.campaign)).size,
      topSource: data.length > 0 ? 
        data.sort((a,b) => 
          data.filter(v => v.params.source === a.params.source).length - 
          data.filter(v => v.params.source === b.params.source).length
        ).pop()?.params.source : 'N/A'
    };
  }, [data]);

  // Prepare Chart Data
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
      const s = d.params.source || 'Direct';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [data]);

  const campaignData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
      const c = d.params.campaign || 'None';
      counts[c] = (counts[c] || 0) + 1;
    });
    // Top 5 campaigns
    return Object.keys(counts)
      .map(name => ({ name, value: counts[name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 mt-20">
        <Layers className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-xl font-semibold text-slate-300">No Data Yet</h3>
        <p>Create your first UTM link to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <p className="text-slate-400">Performance metrics and link distribution.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Total Tracked Links</h3>
            <ExternalLink className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalLinks}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Active Campaigns</h3>
            <Tag className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.uniqueCampaigns}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Top Source</h3>
            <MousePointer2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-white capitalize">{stats.topSource}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Source Distribution */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Traffic Source Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Performance */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Top Campaigns by Volume</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={campaignData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8" 
                width={100}
                tick={{fontSize: 12}}
              />
              <Tooltip 
                cursor={{fill: '#334155', opacity: 0.4}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
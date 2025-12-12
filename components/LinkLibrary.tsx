import React, { useState } from 'react';
import { VideoLinkData } from '../types';
import { Search, Copy, ExternalLink, Calendar, Tag, Trash2 } from 'lucide-react';

interface LinkLibraryProps {
  links: VideoLinkData[];
  onDelete: (id: string) => void;
}

const LinkLibrary: React.FC<LinkLibraryProps> = ({ links, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');

  // Derive unique sources for filter
  const sources = Array.from(new Set(links.map(l => l.params.source)));

  const filteredLinks = links.filter(link => {
    const matchesSearch = 
      link.videoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.params.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = filterSource === 'all' || link.params.source === filterSource;

    return matchesSearch && matchesSource;
  }).sort((a, b) => b.createdAt - a.createdAt); // Newest first

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here, keeping simple for now
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Link Library</h2>
          <p className="text-slate-400">Manage and organize your tracked videos.</p>
        </div>
        
        <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 w-full md:w-64"
              />
            </div>

            {/* Filter */}
            <select 
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Sources</option>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </header>

      {filteredLinks.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
           <p className="text-slate-500">No links found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLinks.map((link) => (
            <div key={link.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all shadow-sm group">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white truncate">{link.videoTitle}</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-500/20">
                      <Tag className="w-3 h-3 mr-1" /> Source: {link.params.source}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-900/50 text-pink-300 border border-pink-500/20">
                      Medium: {link.params.medium}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-300 border border-emerald-500/20">
                      Campaign: {link.params.campaign}
                    </span>
                  </div>
                  
                  <div className="mt-3 text-xs text-slate-500 font-mono truncate bg-slate-900/50 p-2 rounded select-all">
                    {link.generatedUrl}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-center gap-2 md:border-l md:border-slate-700 md:pl-4">
                  <button 
                    onClick={() => copyToClipboard(link.generatedUrl)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a 
                    href={link.generatedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                   <button 
                    onClick={() => onDelete(link.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkLibrary;
import React, { useState, useEffect } from 'react';
import { VideoLinkData, UtmParams, AiSuggestion } from '../types';
import { generateUtmSuggestions } from '../services/gemini';
import { Sparkles, Copy, Check, RefreshCw, ArrowRight, Video, Link as LinkIcon } from 'lucide-react';

interface LinkCreatorProps {
  onSave: (link: VideoLinkData) => void;
}

const LinkCreator: React.FC<LinkCreatorProps> = ({ onSave }) => {
  const [url, setUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [platformContext, setPlatformContext] = useState('');
  
  const [params, setParams] = useState<UtmParams>({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [copied, setCopied] = useState(false);

  // Update generated URL whenever inputs change
  useEffect(() => {
    if (!url) {
      setGeneratedUrl('');
      return;
    }

    try {
      const urlObj = new URL(url);
      if (params.source) urlObj.searchParams.set('utm_source', params.source);
      if (params.medium) urlObj.searchParams.set('utm_medium', params.medium);
      if (params.campaign) urlObj.searchParams.set('utm_campaign', params.campaign);
      if (params.term) urlObj.searchParams.set('utm_term', params.term);
      if (params.content) urlObj.searchParams.set('utm_content', params.content);
      setGeneratedUrl(urlObj.toString());
    } catch (e) {
      // Invalid URL currently, just ignore until valid
      setGeneratedUrl('');
    }
  }, [url, params]);

  const handleAiSuggest = async () => {
    if (!videoTitle) return;
    
    setIsGeneratingAi(true);
    setSuggestions([]);
    
    const results = await generateUtmSuggestions(videoTitle, platformContext);
    setSuggestions(results);
    setIsGeneratingAi(false);
  };

  const applySuggestion = (s: AiSuggestion) => {
    setParams(prev => ({
      ...prev,
      source: s.source,
      medium: s.medium,
      campaign: s.campaign
    }));
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!url || !generatedUrl) return;
    
    const newLink: VideoLinkData = {
      id: crypto.randomUUID(),
      videoTitle: videoTitle || 'Untitled Video',
      originalUrl: url,
      generatedUrl: generatedUrl,
      params: params,
      createdAt: Date.now(),
      clicks: 0
    };

    onSave(newLink);
    
    // Reset form
    setUrl('');
    setVideoTitle('');
    setPlatformContext('');
    setParams({ source: '', medium: '', campaign: '', term: '', content: '' });
    setSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-white">Create Tracking Link</h2>
        <p className="text-slate-400">Generate a UTM-tagged URL for your video.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
            
            {/* Core Info */}
            <div className="space-y-4">
               <h3 className="text-lg font-semibold text-white flex items-center">
                 <Video className="w-5 h-5 mr-2 text-indigo-400"/> Video Details
               </h3>
               
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Target URL</label>
                 <input
                   type="url"
                   placeholder="https://youtube.com/watch?v=..."
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Video Title</label>
                 <input
                   type="text"
                   placeholder="e.g. Summer Vlog 2024"
                   value={videoTitle}
                   onChange={(e) => setVideoTitle(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                 />
               </div>
            </div>
            
            <div className="h-px bg-slate-700 my-6"></div>

            {/* UTM Parameters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-indigo-400"/> Parameters
                </h3>
                <button
                  onClick={handleAiSuggest}
                  disabled={!videoTitle || isGeneratingAi}
                  className="flex items-center text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-3 py-1.5 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingAi ? (
                    <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-1.5" />
                  )}
                  {isGeneratingAi ? 'Thinking...' : 'AI Suggest'}
                </button>
              </div>
              
              {/* Context input for AI (Optional) */}
               {suggestions.length === 0 && !isGeneratingAi && (
                 <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Platform/Goal (Optional context for AI)</label>
                   <input
                     type="text"
                     placeholder="e.g. Twitter launch post"
                     value={platformContext}
                     onChange={(e) => setPlatformContext(e.target.value)}
                     className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                   />
                 </div>
               )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Source <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={params.source}
                    onChange={(e) => setParams({...params, source: e.target.value})}
                    placeholder="e.g. twitter"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Medium <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={params.medium}
                    onChange={(e) => setParams({...params, medium: e.target.value})}
                    placeholder="e.g. social"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Campaign Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={params.campaign}
                    onChange={(e) => setParams({...params, campaign: e.target.value})}
                    placeholder="e.g. summer_vlog_launch"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Advanced toggle or section could go here, keeping it simple for now */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Term (Optional)</label>
                    <input
                      type="text"
                      value={params.term || ''}
                      onChange={(e) => setParams({...params, term: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Content (Optional)</label>
                    <input
                      type="text"
                      value={params.content || ''}
                      onChange={(e) => setParams({...params, content: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Preview & AI Suggestions */}
        <div className="space-y-6">
          
          {/* AI Suggestions Panel */}
          {suggestions.length > 0 && (
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl animate-fade-in">
              <h4 className="text-indigo-300 font-semibold mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" /> AI Suggestions
              </h4>
              <div className="space-y-3">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => applySuggestion(s)}
                    className="w-full text-left bg-slate-900/80 hover:bg-indigo-600/20 border border-indigo-500/20 p-3 rounded-lg transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-indigo-400 font-mono mb-1">{s.source} / {s.medium}</div>
                        <div className="text-sm text-white font-medium">{s.campaign}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview Card */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 break-all min-h-[80px] mb-4 relative group">
              {generatedUrl ? (
                <span className="text-indigo-300 text-sm font-mono">{generatedUrl}</span>
              ) : (
                <span className="text-slate-600 text-sm italic">Complete fields to generate URL...</span>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCopy}
                disabled={!generatedUrl}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-all ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>

              <button
                onClick={handleSave}
                disabled={!generatedUrl || !videoTitle || !params.source}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                Save to Library
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LinkCreator;
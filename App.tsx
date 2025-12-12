import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LinkCreator from './components/LinkCreator';
import LinkLibrary from './components/LinkLibrary';
import Login from './components/Login';
import { ViewState, VideoLinkData } from './types';
import { Menu, Loader2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [links, setLinks] = useState<VideoLinkData[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      // Simulate fetching from "GitHub Base" (Database)
      setIsSyncing(true);
      const userKey = `utm_app_links_${user.id}`;
      const saved = localStorage.getItem(userKey);
      
      setTimeout(() => {
          if (saved) {
            try {
              setLinks(JSON.parse(saved));
            } catch (e) {
              console.error("Failed to parse saved links", e);
              setLinks([]);
            }
          } else {
            setLinks([]);
          }
          setIsSyncing(false);
      }, 800); // Simulate network fetch time
    } else {
        setLinks([]);
    }
  }, [user]);

  // Save to "GitHub Base" (Local Storage with User Key)
  useEffect(() => {
    if (user && !isSyncing) {
      const userKey = `utm_app_links_${user.id}`;
      localStorage.setItem(userKey, JSON.stringify(links));
    }
  }, [links, user, isSyncing]);

  const handleSaveLink = (newLink: VideoLinkData) => {
    setLinks(prev => [newLink, ...prev]);
    setCurrentView('library');
  };

  const handleDeleteLink = (id: string) => {
      if(window.confirm("Are you sure you want to delete this tracked link?")) {
        setLinks(prev => prev.filter(l => l.id !== id));
      }
  };

  if (authLoading) {
     return (
         <div className="min-h-screen bg-slate-950 flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
         </div>
     )
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-50 selection:bg-indigo-500 selection:text-white">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 border-b border-slate-800 z-50 px-4 py-3 flex items-center justify-between">
         <h1 className="font-bold text-white">UTM Architect</h1>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-1">
           <Menu />
         </button>
      </div>

      {/* Sidebar (Desktop + Mobile) */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:block
      `}>
         <Sidebar currentView={currentView} onChangeView={(view) => {
             setCurrentView(view);
             setIsSidebarOpen(false);
         }} />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto h-screen relative">
        
        {/* Sync Indicator */}
        {isSyncing && (
            <div className="absolute top-4 right-4 bg-slate-800 text-xs text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center shadow-lg z-20">
                <Loader2 className="w-3 h-3 mr-2 animate-spin" /> Syncing with GitHub...
            </div>
        )}

        <div className="max-w-6xl mx-auto">
          
          {currentView === 'dashboard' && <Dashboard data={links} />}
          
          {currentView === 'create' && <LinkCreator onSave={handleSaveLink} />}
          
          {currentView === 'library' && <LinkLibrary links={links} onDelete={handleDeleteLink} />}

        </div>
      </main>

    </div>
  );
};

export default App;
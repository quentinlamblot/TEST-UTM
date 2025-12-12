import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Github, Loader2, Link2 } from 'lucide-react';

const Login: React.FC = () => {
  const { loginWithGithub, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Link2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">UTM Architect</h1>
          <p className="text-slate-400">Professional campaign tracking for video creators.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={loginWithGithub}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-[#24292e] hover:bg-[#2f363d] text-white p-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed group border border-slate-700"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <Github className="w-5 h-5 text-white" />
            )}
            <span>{isLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
          </button>
          
          <div className="text-center">
             <p className="text-xs text-slate-500 mt-4">
               By continuing, you agree to connect your GitHub account to sync your tracking links.
             </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-slate-600 text-sm">
        Powered by Gemini AI & GitHub
      </div>
    </div>
  );
};

export default Login;
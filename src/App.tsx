import React from 'react';
import { ExternalLink, MessageCircle, TrendingUp, Users, Gift, Rocket, UserPlus, Twitter } from 'lucide-react';
import ThreePill from './components/ThreePill';

function App() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 z-20">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/40 text-emerald-400 font-bold text-2xl rounded-lg border border-emerald-500/30 backdrop-blur-md">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
            DOSE PODCAST
          </span>
        </div>
      </div>

      {/* Top Right Button */}
      <div className="absolute top-6 right-6 z-20">
        <a
          href="https://pump.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/40 hover:bg-black/60 text-emerald-400 hover:text-emerald-300 font-medium rounded-lg border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-md hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <span className="text-sm">Watch Live on Pump.fun</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Bottom Left Twitter Button */}
      <div className="absolute bottom-6 left-6 z-20">
        <a
          href="https://x.com/i/communities/1968406204444479970/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 text-emerald-400 hover:text-emerald-300 font-medium rounded-lg border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-md hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <Twitter className="w-5 h-5" />
          <span>Join Community</span>
        </a>
      </div>

      {/* Capabilities Box */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-80">
        <div className="bg-black/40 hover:bg-black/50 text-emerald-400 rounded-lg border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-300">DOSE Capabilities</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>Interact live with chat</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <UserPlus className="w-4 h-4 text-emerald-500" />
              <span>Add other people to the stage</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Track $DOSE Market Cap</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Track $DOSE holders</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Gift className="w-4 h-4 text-emerald-500" />
              <span>Run a giveaway for creator rewards</span>
            </div>
          </div>
        </div>
      </div>
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 3D Pill Container */}
      <div className="relative z-10 w-full h-screen">
        <ThreePill />
      </div>
    </div>
  );
}

export default App;
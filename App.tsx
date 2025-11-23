import React, { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { View, UserStats } from './types';
import { calculateLevel, INITIAL_XP_LEVELS } from './constants';
import { LayoutDashboard, MessageSquare, Image as ImageIcon, Box, Share2, Mic, MicOff, Trophy } from 'lucide-react';
import { Dashboard } from './views/Dashboard';
import { AiChat } from './views/AiChat';
import { ImageGen } from './views/ImageGen';
import { Product3D } from './views/Product3D';
import { CollabBoard } from './views/CollabBoard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    streak: 3
  });
  const [isListening, setIsListening] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Simple Gamification Logic
  const addXp = (amount: number) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      if (newLevel > prev.level) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: INITIAL_XP_LEVELS[newLevel] || newXp * 1.5
      };
    });
  };

  // Voice Command Simulation
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        // Just a mock of successful recognition
        console.log("Listening...");
      }, 500);
    }
  };

  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.AI_CHAT, label: 'Neural Chat', icon: MessageSquare },
    { id: View.IMAGINE, label: 'Visual Cortex', icon: ImageIcon },
    { id: View.PRODUCT_3D, label: 'Artifacts', icon: Box },
    { id: View.COLLAB, label: 'Mind Meld', icon: Share2 },
  ];

  const renderView = () => {
    switch(currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.AI_CHAT: return <AiChat addXp={addXp} />;
      case View.IMAGINE: return <ImageGen addXp={addXp} />;
      case View.PRODUCT_3D: return <Product3D />;
      case View.COLLAB: return <CollabBoard addXp={addXp} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="relative w-full h-screen text-gray-100 font-sans selection:bg-neon-pink selection:text-white">
      {/* 3D Background */}
      <Background />

      {/* Level Up Notification */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="glass-panel p-8 rounded-2xl border-2 border-neon-green flex flex-col items-center animate-bounce">
            <Trophy size={64} className="text-neon-green mb-4 drop-shadow-[0_0_15px_rgba(10,255,104,0.8)]" />
            <h2 className="text-4xl font-display font-bold text-white mb-2">LEVEL UP!</h2>
            <p className="text-neon-green text-xl tracking-widest">RANK {userStats.level} ACHIEVED</p>
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="relative z-10 flex h-full">
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 glass-panel border-r border-white/10 flex flex-col justify-between py-6 transition-all duration-300">
          <div>
            <div className="px-6 mb-10">
              <h1 className="hidden lg:block font-display text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
                AETHER
              </h1>
              <div className="lg:hidden text-neon-blue font-bold text-2xl text-center">AE</div>
            </div>

            <nav className="space-y-2 px-2">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,243,255,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue shadow-[0_0_10px_#00f3ff]" />}
                    <item.icon className={`transition-colors ${isActive ? 'text-neon-blue' : 'group-hover:text-neon-pink'}`} />
                    <span className="hidden lg:block font-medium tracking-wide">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="px-4">
             <div className="glass-panel p-4 rounded-xl hidden lg:block">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-xs text-gray-400">OPERATOR LEVEL</span>
                   <span className="text-xl font-display font-bold text-neon-green">{userStats.level}</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-green transition-all duration-1000" 
                      style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                   />
                </div>
                <div className="mt-2 text-xs text-gray-500 text-right">
                   {userStats.xp} / {userStats.nextLevelXp} XP
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Header */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 glass-panel shrink-0">
            <div className="flex items-center gap-4 text-sm text-gray-400">
               <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  SYSTEM OPTIMAL
               </span>
               <span className="hidden md:inline">|</span>
               <span className="hidden md:inline font-mono text-neon-blue opacity-70">
                 {new Date().toLocaleTimeString()} :: LAT 34.0522 N
               </span>
            </div>

            <div className="flex items-center gap-4">
               <button 
                onClick={toggleVoice}
                className={`p-2 rounded-full border transition-all ${isListening ? 'border-red-500 text-red-500 animate-pulse bg-red-500/10' : 'border-gray-600 text-gray-400 hover:border-white hover:text-white'}`}
               >
                  {isListening ? <Mic /> : <MicOff />}
               </button>
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-blue-600 border border-white/20 shadow-lg"></div>
            </div>
          </header>

          {/* View Container */}
          <div className="flex-1 overflow-hidden p-2 lg:p-4">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

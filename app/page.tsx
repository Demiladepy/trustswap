'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { useWallet } from '@/hooks';
import { ParticleBackground } from '@/components/ParticleBackground';
import { SwapInterface } from '@/components/SwapInterface';
import { Leaderboard } from '@/components/Leaderboard';
import { Card, Button, TierBadge } from '@/components/Common';
import { ActivityFeed } from '@/components/ActivityFeed';
import { QuestsPanel } from '@/components/QuestsPanel';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { Achievements } from '@/components/Achievements';

type TabType = 'dashboard' | 'quests' | 'analytics' | 'achievements';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const { walletAddress, userScore, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const isDemoModeStore = useAppStore((state) => state.isDemoMode);

  useEffect(() => {
    setIsDemoMode(isDemoModeStore);
  }, [isDemoModeStore]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground tier={userScore?.tier || 'bronze'} />

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💱</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              TrustSwap
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Demo Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => {
                  setIsDemoMode(e.target.checked);
                  useAppStore.setState({ isDemoMode: e.target.checked });
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-300">Demo Mode</span>
            </label>

            {/* Wallet Button */}
            {walletAddress ? (
              <div className="flex items-center gap-3">
                {userScore && <TierBadge tier={userScore.tier} score={userScore.score} />}
                <Button
                  onClick={() => disconnectWallet()}
                  className="px-4 py-2 text-sm bg-red-900/50 border-red-700/50 hover:border-red-600/50"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => connectWallet()}
                disabled={isConnecting}
                className="px-4 py-2 text-sm bg-cyan-600 border-cyan-500 hover:border-cyan-400"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-30 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-8 overflow-x-auto">
          {(['dashboard', 'quests', 'analytics', 'achievements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'dashboard' && '📊 Dashboard'}
              {tab === 'quests' && '⚡ Quests'}
              {tab === 'analytics' && '🤖 Analytics'}
              {tab === 'achievements' && '🏆 Achievements'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Profile & Swap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Swap Interface */}
              <div className="lg:col-span-2">
                <SwapInterface walletAddress={walletAddress} userScore={userScore} />
              </div>

              {/* Right: Profile & Stats */}
              <div className="space-y-6">
                {/* Profile Card */}
                {walletAddress && userScore && (
                  <Card className="p-6 border-cyan-700/50 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
                    <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Wallet</p>
                        <p className="text-sm font-mono text-cyan-400">{walletAddress.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">TrustScore</p>
                        <p className="text-3xl font-bold text-cyan-400">{userScore.score}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Current Tier</p>
                        <TierBadge tier={userScore.tier} size="lg" />
                      </div>
                      <div className="pt-4 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-2">Percentile Rank</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {Math.floor(userScore.percentileRank)}th
                        </p>
                        <p className="text-xs text-slate-500">Top {Math.ceil(100 - userScore.percentileRank)}%</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Quick Stats */}
                <Card className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400">24h Volume</p>
                    <p className="text-2xl font-bold text-green-400">$2,450</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Success Rate</p>
                    <p className="text-2xl font-bold text-blue-400">94.2%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Total Trades</p>
                    <p className="text-2xl font-bold text-purple-400">28</p>
                  </div>
                </Card>

                {/* Tier Benefits */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Tier Benefits</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>✓ Dynamic fees based on score</li>
                    <li>✓ Higher daily limits</li>
                    <li>✓ MEV protection</li>
                    <li>✓ Priority support</li>
                    <li>✓ Exclusive pools</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Activity + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed />
              <Leaderboard currentUserWallet={walletAddress || undefined} currentUserScore={userScore?.score} />
            </div>
          </div>
        )}

        {/* Quests Tab */}
        {activeTab === 'quests' && <QuestsPanel />}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AdvancedAnalytics walletScore={userScore?.score || 500} />}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && <Achievements />}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>
            TrustSwap • Solana DEX with Reputation Scoring • Phases 1-8 Complete •{' '}
            <span className="text-cyan-400">Production Ready</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

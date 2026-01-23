'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Button } from './Common';

interface AIAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  reasons: string[];
  recommendations: string[];
  explanation: string;
}

interface ChartData {
  time: string;
  score: number;
}

export const AdvancedAnalytics: React.FC<{ walletScore?: number }> = ({ walletScore = 650 }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate mock chart data
    const data = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}h`,
      score: walletScore + Math.random() * 50 - 25,
    }));
    setChartData(data);
  }, [walletScore]);

  const analyzeRisk = async () => {
    setLoading(true);
    // Simulate Claude API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockAnalysis: AIAnalysis = {
      riskLevel: walletScore > 700 ? 'low' : walletScore > 400 ? 'medium' : 'high',
      riskScore: Math.max(20, 100 - (walletScore / 10)),
      reasons: [
        'Account age is 45 days (relatively new)',
        'Trading volume consistency is moderate',
        'No major red flags detected',
        'Score trend is positive ↗',
      ],
      recommendations: [
        'Consider smaller position sizes initially',
        'Diversify across multiple token pairs',
        'Build trading history before large swaps',
        'Monitor portfolio daily',
      ],
      explanation: `Your TrustScore of ${walletScore} indicates ${walletScore > 700 ? 'low risk' : walletScore > 400 ? 'moderate risk' : 'higher risk'}. This score is based on your trading history, account age, and community reputation. Our AI analysis suggests you can safely execute swaps up to ${Math.floor(walletScore * 50)} USDC without triggering MEV concerns.`,
    };

    setAnalysis(mockAnalysis);
    setLoading(false);
  };

  const riskColor = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Score History Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">Score History (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#60a5fa"
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* AI Risk Analyzer */}
      <Card className="p-6 border border-blue-700/50 bg-blue-900/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-100">🤖 AI Risk Analyzer</h3>
          <Button
            onClick={analyzeRisk}
            disabled={loading}
            className="px-4 py-2"
          >
            {loading ? 'Analyzing...' : 'Analyze Trade'}
          </Button>
        </div>

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-slate-400">Risk Level</p>
                <p className={`text-3xl font-bold ${riskColor[analysis.riskLevel]}`}>
                  {analysis.riskLevel.toUpperCase()}
                </p>
              </div>
              <div className="flex-1 h-12 bg-slate-800 rounded-lg overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    analysis.riskLevel === 'low'
                      ? 'bg-gradient-to-r from-green-600 to-green-500'
                      : analysis.riskLevel === 'medium'
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                        : 'bg-gradient-to-r from-red-600 to-red-500'
                  }`}
                  style={{ width: `${analysis.riskScore}%` }}
                />
              </div>
              <p className="text-2xl font-bold text-slate-300">{Math.floor(analysis.riskScore)}</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{analysis.explanation}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">⚠️ Concerns</h4>
                <ul className="space-y-1 text-sm text-slate-400">
                  {analysis.reasons.map((reason, i) => (
                    <li key={i}>• {reason}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">✅ Recommendations</h4>
                <ul className="space-y-1 text-sm text-slate-400">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Staking Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-700/50">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">💎 Stake Your Reputation</h3>
        <p className="text-sm text-slate-300 mb-4">
          Lock your TrustScore to earn yield on your reputation. Higher scores earn more!
        </p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Current APY</span>
            <span className="text-purple-400 font-semibold">24.5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Your Score Stake</span>
            <span className="text-slate-300">{walletScore} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Monthly Earnings</span>
            <span className="text-green-400 font-semibold">+{Math.floor((walletScore * 24.5) / 12)} pts</span>
          </div>
          <Button className="w-full mt-4">Stake Now</Button>
        </div>
      </Card>
    </div>
  );
};

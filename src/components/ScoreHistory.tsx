"use client";

import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';
import { Card } from './design-system/Card';
import { useTier } from '@/context/TierContext';
import { getTheme } from '@/lib/theme';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export const ScoreHistory = () => {
    const { score, tier } = useTier();
    const theme = getTheme(tier);

    // Generate mock history ending at current score
    const generateHistory = () => {
        const data = [];
        const today = new Date();
        let current = score > 0 ? score : 350;

        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const change = Math.floor(Math.random() * 20) - 8;
            current = Math.max(0, Math.min(1000, current + change));
            if (i === 0 && score > 0) current = score;

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: current
            });
        }
        return data;
    };

    const data = React.useMemo(() => generateHistory(), [score]);

    return (
        <Card variant="glass" className="w-full h-[450px] p-6 relative group overflow-hidden" id="analytics">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                        <BarChart3 className="text-white/80" size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-black text-white">REPUTATION ANALYTICS</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">30-Day performance</span>
                            <div className="w-1 h-1 rounded-full bg-green-500" />
                            <span className="text-[10px] font-bold text-green-500 uppercase">Live Tracking</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-green-400 font-bold text-sm mb-1">
                        <TrendingUp size={16} />
                        +12.8%
                    </div>
                    <div className="text-3xl font-heading font-black text-white">{score} XP</div>
                </div>
            </div>

            <div className="h-[280px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={40}
                            tick={{ fontWeight: 700 }}
                        />
                        <YAxis
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 1000]}
                            hide
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0D0221',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(10px)'
                            }}
                            itemStyle={{ color: theme.primary, fontWeight: 900, fontSize: '14px' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '4px', fontSize: '12px', fontWeight: 700 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke={theme.primary}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            animationDuration={2000}
                        />
                        <ReferenceLine y={score} stroke={theme.primary} strokeDasharray="3 3" opacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                    <Calendar className="text-gray-500" size={18} />
                    <span className="text-xs font-bold text-gray-400">Next update scheduled for <span className="text-white">Tomorrow, 08:00 UTC</span></span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
                    Export Data
                </button>
            </div>
        </Card>
    );
};

"use client";

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { Card } from './design-system/Card';
import { useTier } from '@/context/TierContext';

export const ScoreHistory = () => {
    const { score, tier } = useTier();

    // Generate mock history ending at current score
    const generateHistory = () => {
        const data = [];
        const today = new Date();
        let current = score > 0 ? score : 350; // default start if 0

        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Random walk
            const change = Math.floor(Math.random() * 20) - 8;
            current = Math.max(0, Math.min(1000, current + change));

            // Force last point to match actual score if available
            if (i === 0 && score > 0) current = score;

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: current
            });
        }
        return data;
    };

    const data = React.useMemo(() => generateHistory(), [score]);

    const getStrokeColor = () => {
        switch (tier) {
            case 'diamond': return '#22d3ee';
            case 'gold': return '#fbbf24';
            case 'silver': return '#94a3b8';
            default: return '#f97316';
        }
    };

    return (
        <Card variant="glass" className="w-full h-[400px] p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-heading font-bold text-white">Score History</h3>
                    <p className="text-sm text-gray-400">30 Day Performance</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{score}</div>
                    <div className="text-xs text-green-400">+12.5% this month</div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getStrokeColor()} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={getStrokeColor()} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 1000]}
                        hide
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0D0221',
                            border: '1px solid #ffffff20',
                            borderRadius: '8px'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke={getStrokeColor()}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

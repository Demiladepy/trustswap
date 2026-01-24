"use client";

import React, { useState } from 'react';
import { Card } from './design-system/Card';
import { Button } from './design-system/Button';
import { useTier } from '@/context/TierContext';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

export const ReputationStaking = () => {
    const { score, tier } = useTier();
    const [stakeAmount, setStakeAmount] = useState(0);
    const [isStaked, setIsStaked] = useState(false);
    const [stakedAmount, setStakedAmount] = useState(0);

    const maxStake = score;

    const handleStake = () => {
        setIsStaked(true);
        setStakedAmount(stakeAmount);
    };

    const handleUnstake = () => {
        setIsStaked(false);
        setStakedAmount(0);
    };

    return (
        <Card variant="glass" className="h-[400px] relative overflow-hidden group">
            {/* Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent transition-opacity duration-500 ${isStaked ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative z-10 p-1">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Shield className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-heading font-bold text-white">Reputation Staking</h3>
                        <p className="text-sm text-gray-400">Stake Score for 2x Rewards</p>
                    </div>
                </div>

                {!isStaked ? (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-yellow-400 shrink-0 mt-1" size={16} />
                                <p className="text-sm text-gray-300">
                                    Staking your reputation unlocks <strong>Double Fee Discounts</strong> but puts your score at risk if you are flagged for malicious trading.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Stake Amount</span>
                                <span className="font-bold text-white">{stakeAmount} pts</span>
                            </div>

                            <div className="relative w-full h-6 flex items-center">
                                <input
                                    type="range"
                                    min={0}
                                    max={maxStake}
                                    step={10}
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>

                            <div className="flex justify-between text-xs text-gray-500">
                                <span>0</span>
                                <span>Max: {maxStake}</span>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleStake}
                            disabled={stakeAmount === 0}
                            className="bg-purple-600 hover:bg-purple-500"
                        >
                            Stake Reputation
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] space-y-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse border border-purple-500/50">
                            <Lock className="text-purple-400" size={32} />
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-white mb-1">{stakedAmount} PTS</div>
                            <div className="text-sm text-purple-300 font-medium">CURRENTLY STAKED</div>
                        </div>

                        <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm font-bold border border-green-500/20">
                            Assessment Phase: Active
                        </div>

                        <Button
                            variant="ghost"
                            onClick={handleUnstake}
                            className="text-gray-400 hover:text-white"
                        >
                            Unstake (7 Day Cooldown)
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

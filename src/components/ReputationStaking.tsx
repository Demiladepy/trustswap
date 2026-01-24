"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './design-system/Card';
import { Button } from './design-system/Button';
import { useTier } from '@/context/TierContext';
import { Shield, AlertTriangle, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { getTheme } from '@/lib/theme';
import { toast } from 'sonner';

export const ReputationStaking = () => {
    const { score, tier } = useTier();
    const theme = getTheme(tier);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [isStaked, setIsStaked] = useState(false);
    const [stakedAmount, setStakedAmount] = useState(0);

    const maxStake = score;

    const handleStake = () => {
        setIsStaked(true);
        setStakedAmount(stakeAmount);
        toast.info('Initial Staking Phase Active', {
            description: `${stakeAmount} XP has been locked for protocol benefits.`,
            icon: <Lock className="w-4 h-4" />
        });
    };

    const handleUnstake = () => {
        setIsStaked(false);
        setStakedAmount(0);
        toast('Unstaking Request Submitted', {
            description: 'Funds will be available after the 7-day cooldown.',
        });
    };

    return (
        <Card variant="glass" className="h-[450px] relative overflow-hidden group" id="staking">
            {/* Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-transparent transition-opacity duration-1000 ${isStaked ? 'opacity-100' : 'opacity-0'}`} />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 p-2 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-inner backdrop-blur-md">
                        <Shield className="text-purple-400" size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading font-black text-white">STAKING</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Leveaged Reputation</p>
                    </div>
                </div>

                {!isStaked ? (
                    <div className="flex-1 flex flex-col">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                                    <AlertTriangle size={18} />
                                </div>
                                <p className="text-xs leading-relaxed text-gray-400 font-medium">
                                    Staking unlocks <strong className="text-white">Double Fee Discounts</strong>.
                                    Warning: Staked XP can be slashed up to 50% for protocol violations.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8 mt-auto">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Select Stake Volume</span>
                                <div className="text-right">
                                    <div className="text-2xl font-heading font-black text-white">{stakeAmount} <span className="text-xs text-purple-400">XP</span></div>
                                </div>
                            </div>

                            <div className="relative w-full h-8 flex items-center group/slider">
                                <div className="absolute inset-x-0 h-2 bg-white/5 rounded-full border border-white/5" />
                                <div
                                    className="absolute inset-y-1 left-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                                    style={{ width: `${(stakeAmount / maxStake) * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={maxStake}
                                    step={10}
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                                    className="w-full h-8 bg-transparent appearance-none cursor-pointer relative z-10 accent-white"
                                />
                            </div>

                            <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                                <span>0%</span>
                                <span>100% Locked</span>
                            </div>
                        </div>

                        <Button
                            tier={tier}
                            fullWidth
                            size="lg"
                            onClick={handleStake}
                            disabled={stakeAmount === 0}
                            className="bg-purple-600 hover:bg-purple-500 border-purple-400/30 shadow-purple-500/20"
                        >
                            Confirm Staking
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-8 bg-purple-500/20 blur-3xl rounded-full"
                            />
                            <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/50 relative z-10 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                <Lock className="text-purple-400" size={40} />
                            </div>
                        </div>

                        <div>
                            <div className="text-5xl font-heading font-black text-white mb-2">{stakedAmount} <span className="text-xl text-purple-400">XP</span></div>
                            <div className="text-xs font-black text-purple-300 uppercase tracking-[0.3em]">Vaulted Portfolio</div>
                        </div>

                        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-6 py-3 rounded-2xl text-[10px] font-black border border-green-500/20 uppercase tracking-widest">
                            <TrendingUp size={14} />
                            2x Reward Multiplier Active
                        </div>

                        <button
                            onClick={handleUnstake}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors"
                        >
                            Request Withdrawal (Cooldown active)
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};

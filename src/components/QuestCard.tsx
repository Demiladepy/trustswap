"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './design-system/Card';
import { CheckCircle2, Circle, Target, Sparkles, Trophy } from 'lucide-react';
import { useTier } from '@/context/TierContext';
import { Button } from './design-system/Button';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const QuestItem = ({
    quest,
    isCompleted,
    onComplete
}: {
    quest: any,
    isCompleted: boolean,
    onComplete: () => void
}) => {
    return (
        <motion.div
            layout
            className={`
                relative group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-500
                ${isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }
            `}
        >
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0
                ${isCompleted
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                }
            `}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold transition-all ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {quest.title}
                    </h3>
                    <div className={`
                        text-[10px] font-black px-2 py-1 rounded-md tracking-widest
                        ${isCompleted
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }
                    `}>
                        +{quest.points} XP
                    </div>
                </div>
                <p className={`text-xs ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                    {quest.description || "Incomplete mission"}
                </p>

                {isCompleted && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                        <Sparkles size={10} />
                        Quest Complete
                    </div>
                )}
            </div>

            {!isCompleted && (
                <button
                    onClick={onComplete}
                    className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                    aria-label="Complete Quest"
                />
            )}
        </motion.div>
    );
};

export const QuestCard = () => {
    const { setScore, score, tier } = useTier();
    const [completedQuests, setCompletedQuests] = useState<number[]>([]);

    const quests = [
        { id: 1, title: "Identity Sync", points: 50, description: "Connect your primary Solana wallet" },
        { id: 2, title: "Initial Liquidity", points: 100, description: "Complete your first token swap" },
        { id: 3, title: "Capital Reserve", points: 150, description: "Hold more than 10 SOL in assets" },
        { id: 4, title: "Trust Advocate", points: 200, description: "Refer a peer to the network" },
    ];

    const handleComplete = (id: number, points: number) => {
        if (completedQuests.includes(id)) return;

        setCompletedQuests([...completedQuests, id]);
        setScore(score + points);

        toast.success('Quest Completed!', {
            description: `You've earned +${points} XP towards your reputation.`,
            icon: <Sparkles className="w-4 h-4 text-cyan-400" />
        });

        confetti({
            particleCount: 100,
            spread: 60,
            origin: { x: 0.8, y: 0.8 }
        });
    };

    const progress = (completedQuests.length / quests.length) * 100;

    return (
        <Card variant="standard" className="h-full relative overflow-hidden" id="quests">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                        <Target className="text-cyan-400" size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-heading font-black text-white">MISSIONS</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Level up your trust score</p>
                    </div>
                </div>
                <div className="text-3xl font-heading font-black text-cyan-400">
                    {Math.round(progress)}%
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden mb-8 p-0.5 border border-white/5">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                >
                    <div className="absolute inset-x-0 h-1/2 bg-white/20 top-0 rounded-full" />
                </motion.div>
            </div>

            <div className="space-y-4">
                {quests.map((quest) => (
                    <QuestItem
                        key={quest.id}
                        quest={quest}
                        isCompleted={completedQuests.includes(quest.id)}
                        onComplete={() => handleComplete(quest.id, quest.points)}
                    />
                ))}
            </div>

            <div className="mt-8">
                <Button variant="ghost" fullWidth tier={tier} className="text-xs font-black uppercase tracking-[0.2em] h-10 border border-white/5">
                    View Archive
                </Button>
            </div>
        </Card>
    );
};

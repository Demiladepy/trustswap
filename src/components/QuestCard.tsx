"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './design-system/Card';
import { CheckCircle2, Circle, Target } from 'lucide-react';
import { useTier } from '@/context/TierContext';

const QuestItem = ({
    title,
    points,
    isCompleted,
    onComplete
}: {
    title: string,
    points: number,
    isCompleted: boolean,
    onComplete: () => void
}) => {
    return (
        <motion.div
            layout
            className={`
        relative group flex items-center justify-between p-4 rounded-xl border transition-all duration-300
        ${isCompleted
                    ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50'
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }
      `}
            onClick={!isCompleted ? onComplete : undefined}
            style={{ cursor: isCompleted ? 'default' : 'pointer' }}
        >
            <div className="flex items-center gap-4">
                <div className={`
           w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500
           ${isCompleted ? 'text-[var(--color-primary)]' : 'text-gray-500 group-hover:text-gray-300'}
         `}>
                    {isCompleted ? <CheckCircle2 /> : <Circle />}
                </div>
                <span className={isCompleted ? 'line-through text-gray-500' : 'text-white'}>
                    {title}
                </span>
            </div>

            <div className={`
        text-xs font-bold px-2 py-1 rounded-md
        ${isCompleted
                    ? 'bg-[var(--color-primary)] text-black'
                    : 'bg-white/10 text-[var(--color-primary)]'
                }
      `}>
                +{points} XP
            </div>

            {/* Confetti effect could go here */}
        </motion.div>
    );
};

export const QuestCard = () => {
    const { setScore, score } = useTier();
    const [completedQuests, setCompletedQuests] = useState<number[]>([]);

    const quests = [
        { id: 1, title: "Connect Wallet", points: 50 },
        { id: 2, title: "Complete First Swap", points: 100 },
        { id: 3, title: "Hold 10 SOL", points: 150 },
        { id: 4, title: "Refer a Friend", points: 200 },
    ];

    const handleComplete = (id: number, points: number) => {
        if (completedQuests.includes(id)) return;

        setCompletedQuests([...completedQuests, id]);
        // Add points to global score
        setScore(score + points);
    };

    const progress = (completedQuests.length / quests.length) * 100;

    return (
        <Card variant="standard" className="h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[var(--color-surface)] rounded-xl border border-white/10">
                        <Target className="text-[var(--color-accent)]" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-semibold">FairScale Quests</h2>
                        <p className="text-sm text-gray-400">Complete tasks to boost your score</p>
                    </div>
                </div>
                <div className="text-2xl font-heading font-bold text-[var(--color-accent)]">
                    {Math.round(progress)}%
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div
                    className="h-full bg-[var(--color-accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                />
            </div>

            <div className="space-y-3">
                {quests.map((quest) => (
                    <QuestItem
                        key={quest.id}
                        title={quest.title}
                        points={quest.points}
                        isCompleted={completedQuests.includes(quest.id)}
                        onComplete={() => handleComplete(quest.id, quest.points)}
                    />
                ))}
            </div>
        </Card>
    );
};

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';
import { analyzeSwapRisk } from '@/api/claude';

interface RiskAnalyzerProps {
    amount: string;
    tokenSymbol: string;
    userScore: number;
    isVisible: boolean;
}

export const RiskAnalyzer = ({ amount, tokenSymbol, userScore, isVisible }: RiskAnalyzerProps) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        riskLevel: 'Low' | 'Medium' | 'High';
        explanation: string;
    } | null>(null);

    useEffect(() => {
        if (isVisible && amount && parseFloat(amount) > 0) {
            setLoading(true);
            setResult(null);

            const timer = setTimeout(async () => {
                const data = await analyzeSwapRisk(parseFloat(amount), tokenSymbol, userScore);
                setResult(data);
                setLoading(false);
            }, 500); // Debounce slightly

            return () => clearTimeout(timer);
        } else {
            setResult(null);
            setLoading(false);
        }
    }, [amount, tokenSymbol, userScore, isVisible]);

    if (!isVisible && !result) return null;

    return (
        <AnimatePresence>
            {(loading || result) && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="w-full mt-4"
                >
                    <div className={`
            rounded-xl p-4 border backdrop-blur-md relative overflow-hidden
            ${loading ? 'bg-blue-500/5 border-blue-500/20' : ''}
            ${result?.riskLevel === 'Low' ? 'bg-green-500/10 border-green-500/20' : ''}
            ${result?.riskLevel === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20' : ''}
            ${result?.riskLevel === 'High' ? 'bg-red-500/10 border-red-500/20' : ''}
          `}>
                        {/* Background Pulse for AI effect */}
                        {loading && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        )}

                        <div className="flex items-start gap-4 reltive z-10">
                            <div className="mt-1">
                                {loading ? (
                                    <BrainCircuit className="w-6 h-6 text-blue-400 animate-pulse" />
                                ) : result?.riskLevel === 'Low' ? (
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                ) : result?.riskLevel === 'Medium' ? (
                                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                ) : (
                                    <Shield className="w-6 h-6 text-red-400" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-white">
                                        {loading ? 'AI Risk Analysis' : `${result?.riskLevel} Risk Detected`}
                                    </h3>
                                    {!loading && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border
                        ${result?.riskLevel === 'Low' ? 'bg-green-500/20 text-green-300 border-green-500/30' : ''}
                        ${result?.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : ''}
                        ${result?.riskLevel === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' : ''}
                      `}>
                                            Claude AI
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {loading ? (
                                        <span className="animate-pulse">Analyzing transaction patterns, wallet history, and FairScore...</span>
                                    ) : (
                                        result?.explanation
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

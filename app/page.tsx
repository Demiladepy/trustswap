"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SwapInterface } from '@/components/SwapInterface';
import { Leaderboard } from '@/components/Leaderboard';
import { QuestCard } from '@/components/QuestCard';
import { motion } from 'framer-motion';
import { ScoreHistory } from '@/components/ScoreHistory';
import { ReputationStaking } from '@/components/ReputationStaking';
import { TrustNetwork } from '@/components/TrustNetwork';

export default function Home() {
  return (
    <main className="min-h-screen pb-20 selection:bg-[var(--color-primary)] selection:text-black">
      <Navbar />

      <div className="pt-20"> {/* Offset for Fixed Navbar */}
        <HeroSection />

        {/* Adjusted z-index and pointer-events to ensure Hero interactions work */}
        <div className="container mx-auto px-4 md:px-8 xl:px-12 -mt-10 md:-mt-20 relative z-20 pointer-events-none">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pointer-events-none">

            {/* Left Column: Actions */}
            <motion.div
              className="xl:col-span-4 flex flex-col gap-6 pointer-events-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SwapInterface />
              <ReputationStaking />
            </motion.div>

            {/* Right Column: Analytics & Community */}
            <motion.div
              className="xl:col-span-8 flex flex-col gap-8 pointer-events-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreHistory />
                <div className="min-h-[400px]">
                  <TrustNetwork />
                </div>
              </div>

              <div className="p-1">
                <h3 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 bg-[var(--color-primary)] rounded-full" />
                  Quests & Rankings
                </h3>
              </div>

              {/* Lower Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-full">
                  <QuestCard />
                </div>
                <div className="h-full">
                  <Leaderboard />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}

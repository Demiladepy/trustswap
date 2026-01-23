"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SwapInterface } from '@/components/SwapInterface';
import { Leaderboard } from '@/components/Leaderboard';
import { QuestCard } from '@/components/QuestCard';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen pb-20 selection:bg-[var(--color-primary)] selection:text-black">
      <Navbar />

      <div className="pt-20"> {/* Offset for Fixed Navbar */}
        <HeroSection />

        {/* Adjusted z-index and pointer-events to ensure Hero interactions work */}
        <div className="container mx-auto px-4 md:px-8 xl:px-12 -mt-10 md:-mt-20 relative z-20 pointer-events-none">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pointer-events-none">

            {/* Primary Action Feature: Swap */}
            <motion.div
              className="xl:col-span-5 flex flex-col gap-6 pointer-events-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SwapInterface />

              {/* Promotional Banner */}
              <div className="hidden xl:block p-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 border border-[var(--color-primary)]/20">
                <h3 className="font-heading font-bold text-xl mb-2">Boost your Reputation</h3>
                <p className="text-sm text-gray-300 mb-4">Complete daily quests and maintain volume to reach Diamond Tier.</p>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] w-3/4" />
                </div>
              </div>
            </motion.div>

            {/* Right Dashboard Area */}
            <motion.div
              className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="md:col-span-2 p-1">
                <h3 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 bg-[var(--color-primary)] rounded-full" />
                  Community & Rewards
                </h3>
              </div>

              <div className="h-full min-h-[400px]">
                <QuestCard />
              </div>

              <div className="h-full min-h-[400px]">
                <Leaderboard />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}

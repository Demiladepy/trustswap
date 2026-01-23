# TrustSwap - Solana DEX with FairScale Reputation Scoring

A production-ready token swap platform on Solana where **FairScale reputation scores determine user experience, fees, limits, and feature access**. Built for the $700 USDC bounty challenge.

## 🚀 Project Overview

TrustSwap integrates FairScale's reputation scoring system into a DEX, creating a trust-based trading ecosystem with:
- **Dynamic fees** (0.5% to 0%) based on reputation tier
- **Tier-gated features** (limit orders, MEV protection, exclusive pools)
- **Gamification** (quests, achievements, leaderboards)
- **AI risk assessment** using Claude API
- **Beautiful, animated UI** with particle effects and glass morphism

## 📊 Tier System

| Tier | Score | Fee | Daily Limit | Features |
|------|-------|-----|-------------|----------|
| **Bronze** | 0-299 | 0.5% | $1K | Basic swap, standard support |
| **Silver** | 300-599 | 0.3% | $10K | Priority routing, premium support |
| **Gold** | 600-799 | 0.1% | $50K | MEV protection, limit orders, analytics |
| **Diamond** | 800+ | 0% | Unlimited | All features + VIP treatment |

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 19** + TypeScript
- **TailwindCSS 4** + shadcn/ui
- **Framer Motion** (animations)
- **Recharts** (data visualization)
- **Zustand** (state management)

### Blockchain & APIs
- **@solana/web3.js** (Solana blockchain)
- **@solana/wallet-adapter** (wallet integration)
- **Jupiter Aggregator API** (token swaps)
- **FairScale API** (reputation scores)
- **Anthropic Claude API** (AI risk analysis)

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

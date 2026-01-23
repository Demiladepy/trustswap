# 🎯 TrustSwap Quick Start Guide

## ⚡ 60-Second Setup

```bash
cd c:\Users\User\Desktop\okays\trustswap
npm install                 # If first time
npm run dev                 # Start dev server
# Open http://localhost:3000
```

**Demo Mode**: ✅ Already enabled by default  
**Wallet**: 🔌 Auto-connects on page load  
**FairScore**: 📊 Generates mock score  

---

## 🏗️ Project Structure Quick Map

```
src/
├── api/                 # External APIs (FairScale, Jupiter)
├── components/          # React components (Swap, Leaderboard, etc.)
├── hooks/              # Custom hooks (useWallet, useSwap)
├── lib/                # Business logic (tier system)
├── store/              # Zustand global state
├── types/              # TypeScript type definitions
└── utils/              # Helper functions

app/
├── layout.tsx          # Root wrapper
├── page.tsx            # Home dashboard
└── globals.css         # Global styles + animations
```

---

## 🔌 Adding a New Component

### 1. Create Component File
```typescript
// src/components/MyComponent.tsx
'use client';

import React from 'react';
import { Card, Button } from './Common';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Button onClick={() => alert('Clicked!')}>Click Me</Button>
    </Card>
  );
};
```

### 2. Import in Page
```typescript
import { MyComponent } from '@/components/MyComponent';

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <MyComponent title="My New Feature" />
    </div>
  );
}
```

### 3. Rebuild & Test
```bash
npm run build
npm run dev
```

---

## 🎨 Using the UI System

### Available Components (from `src/components/Common.tsx`)

#### Button
```typescript
<Button onClick={handleClick}>Click Me</Button>
<Button variant="secondary">Secondary</Button>
<Button isLoading={true}>Loading...</Button>
<Button disabled>Disabled</Button>
```

#### Card
```typescript
<Card>Content</Card>
<Card hover>Hoverable card</Card>
<Card className="bg-slate-900/50">Custom styling</Card>
```

#### TierBadge
```typescript
<TierBadge tier="diamond" score={850} size="lg" />
<TierBadge tier="gold" score={650} size="sm" showScore={true} />
```

#### Skeleton
```typescript
<Skeleton height="40px" />
<Skeleton height="60px" width="80%" />
```

#### Toast
```typescript
const [toast, setToast] = useState(null);
setToast({ message: 'Success!', type: 'success' });

// In JSX:
{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
```

---

## 🎯 Using Hooks

### useWallet - Manage wallet connection
```typescript
import { useWallet } from '@/hooks';

const { 
  walletAddress,    // Current wallet or null
  userScore,        // FairScoreData object
  isConnecting,     // Loading state
  error,            // Error message
  connectWallet,    // Function to connect
  disconnectWallet, // Function to disconnect
} = useWallet();
```

### useSwap - Handle token swaps
```typescript
import { useSwap } from '@/hooks';

const {
  tokens,        // Available tokens
  quote,         // Current swap quote
  isLoading,     // Loading state
  error,         // Error message
  fetchQuote,    // Get new quote
  executeSwapTx, // Execute swap
} = useSwap(walletAddress);

// Fetch a quote:
const quote = await fetchQuote('inputMint', 'outputMint', amount);

// Execute swap:
const result = await executeSwapTx(quote);
```

---

## 💾 Working with Global State (Zustand)

### Access Store
```typescript
import { useAppStore } from '@/store';

const { 
  userScore, 
  setUserScore,
  quests,
  updateQuest,
  completeQuest,
  stakingPositions,
  addStakingPosition,
  dailyVolume,
  addToDaily,
  isDemoMode,
} = useAppStore();
```

### Update State
```typescript
// Update user score
setUserScore(newScoreData);

// Update quest progress
updateQuest('first_swap', 1);

// Complete a quest
completeQuest('first_swap');

// Add to daily volume
addToDaily(100);
```

---

## 🎨 Styling Guide

### TailwindCSS Classes
```jsx
// Colors (tier-based)
<div className="text-cyan-400">Diamond color</div>
<div className="text-yellow-400">Gold color</div>
<div className="text-gray-300">Silver color</div>
<div className="text-orange-400">Bronze color</div>

// Glass morphism
<div className="glass">Frosted glass effect</div>

// Gradients
<div className="bg-gradient-to-r from-cyan-400 to-blue-500">
  Beautiful gradient
</div>

// Animations
<div className="animate-slideIn">Slides in</div>
<div className="animate-fadeIn">Fades in</div>
<div className="animate-glow">Glows</div>
```

### Custom CSS Classes (from globals.css)
```css
.glass { /* Glass morphism */ }
.gradient-text { /* Gradient text */ }
.animate-slideIn { /* Slide animation */ }
.animate-fadeIn { /* Fade animation */ }
.animate-glow { /* Glow effect */ }
.skeleton { /* Loading skeleton */ }
```

---

## 📊 Tier System Reference

### Get Tier Config
```typescript
import { TIER_CONFIG, getTierFromScore, getTierConfig } from '@/lib/tier';

const tier = getTierFromScore(750);  // 'gold'
const config = getTierConfig('gold');

// config = {
//   type: 'gold',
//   fee: 0.1,
//   dailyLimit: 50000,
//   features: [...],
//   color: '#FFD700',
// }
```

### Check Next Tier
```typescript
import { getScoreTillNextTier } from '@/lib/tier';

const { nextTier, scoreNeeded } = getScoreTillNextTier(650);
// { nextTier: 'diamond', scoreNeeded: 150 }
```

---

## 🔍 Debugging

### Check Component Props
```typescript
// Add to component:
useEffect(() => {
  console.log('Props:', { walletAddress, userScore });
}, [walletAddress, userScore]);
```

### Check Store State
```typescript
import { useAppStore } from '@/store';

export function DebugStore() {
  const store = useAppStore();
  return <pre>{JSON.stringify(store, null, 2)}</pre>;
}
```

### View API Responses
```typescript
// In browser DevTools > Network tab:
// Look for requests to api.fairscale.io, quote-api.jup.ag, etc.
```

---

## 🚀 Common Tasks

### Add a New Feature to Swap
```typescript
// In src/components/SwapInterface.tsx
// Add new state:
const [newFeature, setNewFeature] = useState(false);

// Add UI in JSX:
{newFeature && <div>New Feature UI</div>}
```

### Add a New Toast Notification
```typescript
setToast({
  message: 'Feature completed!',
  type: 'success', // or 'error', 'info', 'warning'
});
```

### Add a Quest
```typescript
// In src/store/index.ts, update initial quests array:
{
  id: 'new_quest',
  title: 'Quest Title',
  description: 'Quest description',
  reward: 50,
  progress: 0,
  maxProgress: 1,
  completed: false,
  category: 'trading',
}
```

---

## 📱 Testing

### Run Build
```bash
npm run build
# Should complete with "✓ Compiled successfully"
```

### Run Tests (if added)
```bash
# Add testing framework in future phases
npm test
```

### Check Lint
```bash
npm run lint
```

---

## 🔑 Key Files to Know

| File | What's Inside |
|------|---------------|
| `src/lib/tier.ts` | Tier calculations & config |
| `src/api/fairscale.ts` | FairScore fetching |
| `src/api/jupiter.ts` | Swap quotes & execution |
| `src/store/index.ts` | Global state management |
| `src/utils/index.ts` | Helper functions |
| `app/globals.css` | All animations & themes |
| `src/components/Common.tsx` | Base UI components |

---

## 🎯 Before Committing

1. ✅ Run `npm run build`
2. ✅ Verify no TypeScript errors
3. ✅ Check responsiveness on mobile
4. ✅ Test in demo mode
5. ✅ Update BUILD_SUMMARY.md if needed

---

## 💡 Pro Tips

1. **Use `clsx`** for conditional classes:
   ```typescript
   className={clsx(
     'base-class',
     isActive && 'active-class',
     variant === 'primary' && 'primary-class'
   )}
   ```

2. **Use `formatNumber`** for currency:
   ```typescript
   import { formatNumber, formatCurrency } from '@/utils';
   formatCurrency(1000)  // "$1,000.00"
   formatNumber(1000)    // "1,000.00"
   ```

3. **Auto-format on save** - Add to VS Code settings:
   ```json
   "[typescript]": {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true
   }
   ```

4. **Use React DevTools** - Install extension for debugging components

5. **Check component tree** - Browser DevTools > Components tab

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then kill process |
| Build fails | `rm -rf .next && npm run build` |
| Types error | Check `tsconfig.json` paths |
| Import not found | Verify file exists and path is correct |
| Style not applying | Check specificity and class name spelling |

---

## 🎊 You're All Set!

The project is ready for Phase 4 (UI Polish) and beyond.

**Current Status**: ✅ Phases 1-3 complete, dev server running

**Next Goal**: Add more animations and polish UI for maximum wow factor!

Questions? Check the files for inline documentation! 💪

---

*TrustSwap Developer Guide*  
*Last Updated: January 23, 2026*

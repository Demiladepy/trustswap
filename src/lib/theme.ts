export const tierThemes = {
    bronze: {
        name: 'Bronze',
        primary: '#CD7F32',
        secondary: '#B87333',
        accent: '#FF6B35',
        glow: 'rgba(205, 127, 50, 0.3)',
        gradient: 'from-orange-600 via-orange-500 to-amber-600',
        shadow: 'shadow-orange-500/30',
    },
    silver: {
        name: 'Silver',
        primary: '#C0C0C0',
        secondary: '#A8A9AD',
        accent: '#E8F1F5',
        glow: 'rgba(192, 192, 192, 0.3)',
        gradient: 'from-gray-400 via-gray-300 to-slate-400',
        shadow: 'shadow-gray-400/30',
    },
    gold: {
        name: 'Gold',
        primary: '#FFD700',
        secondary: '#FFC107',
        accent: '#FFAB00',
        glow: 'rgba(255, 215, 0, 0.4)',
        gradient: 'from-yellow-500 via-yellow-400 to-amber-500',
        shadow: 'shadow-yellow-500/40',
    },
    diamond: {
        name: 'Diamond',
        primary: '#00D9FF',
        secondary: '#00B8D4',
        accent: '#00E5FF',
        glow: 'rgba(0, 217, 255, 0.5)',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
        shadow: 'shadow-cyan-500/50',
    },
};

export type TierType = keyof typeof tierThemes;

export const getTheme = (tier: string) => {
    return tierThemes[tier as TierType] || tierThemes.bronze;
};

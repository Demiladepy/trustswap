// LocalStorage utilities for TrustSwap user data
// All data is namespaced by wallet address for multi-user support

export const getUserData = (wallet: string) => {
  const raw = localStorage.getItem(`trustswap:user:${wallet}`);
  return raw ? JSON.parse(raw) : {
    profile: {},
    tradingHistory: [],
    portfolio: [],
    quests: [],
    badges: [],
    referrals: [],
    tournaments: [],
    analytics: {},
    testimonials: []
  };
};

export const setUserData = (wallet: string, data: any) => {
  localStorage.setItem(`trustswap:user:${wallet}` , JSON.stringify(data));
};

export const addTrade = (wallet: string, trade: any) => {
  const data = getUserData(wallet);
  data.tradingHistory.push(trade);
  setUserData(wallet, data);
};

export const updatePortfolio = (wallet: string, portfolio: any[]) => {
  const data = getUserData(wallet);
  data.portfolio = portfolio;
  setUserData(wallet, data);
};

export const addQuest = (wallet: string, quest: any) => {
  const data = getUserData(wallet);
  data.quests.push(quest);
  setUserData(wallet, data);
};

export const addBadge = (wallet: string, badge: any) => {
  const data = getUserData(wallet);
  data.badges.push(badge);
  setUserData(wallet, data);
};

export const addReferral = (wallet: string, referral: any) => {
  const data = getUserData(wallet);
  data.referrals.push(referral);
  setUserData(wallet, data);
};

export const addTournament = (wallet: string, tournament: any) => {
  const data = getUserData(wallet);
  data.tournaments.push(tournament);
  setUserData(wallet, data);
};

export const addTestimonial = (wallet: string, testimonial: any) => {
  const data = getUserData(wallet);
  data.testimonials.push(testimonial);
  setUserData(wallet, data);
};

export const updateAnalytics = (wallet: string, analytics: any) => {
  const data = getUserData(wallet);
  data.analytics = analytics;
  setUserData(wallet, data);
};

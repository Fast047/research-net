// utils/network-helpers.ts
export const netTN = (themeKey: string) => THEMES[themeKey as keyof typeof THEMES]?.name || themeKey;

export const networkRankForTheme = (theme: string, excludeIds: string[] = [], limit = 4) => {
  return RESEARCHERS
    .filter(r => !excludeIds.includes(r.id))
    .map(r => ({ ...r, score: r.score_by_theme[theme as keyof typeof r.score_by_theme] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
export const useFeasibility = () => {
  const form = reactive({
    name: '', inst: '', country: '', budget: '', obj: '',
    selectedTheme: 'AI',
    selectedKeywords: [] as string[]
  });

  const results = ref<any>(null);

  const calculateFeasibility = (val:any) => {
    results.value = null;
    if (!val) return;

    form.name = val.name ?? '';
    form.inst = val.inst ?? '';
    form.country = val.country ?? '';
    form.budget = val.budget ?? '';
    form.obj = val.obj ?? '';
    form.selectedTheme = val.theme ?? '';
    form.selectedKeywords = val.keywords ?? [];

    const theme = form.selectedTheme;
    const kws = form.selectedKeywords;
    const topResearchers = rankForTheme(theme, kws, 6);
    // 1. Rank Researchers (Top 6)
    const rankedResearchers = RESEARCHERS.map(r => {
      const themeScore = r.score_by_theme[theme as keyof typeof r.score_by_theme] || 0;
      const kwMatch = r.expertise.filter(e => kws.some(k => e.includes(k))).length;
      const historyCount = HISTORY.filter(h => h.researcher_id === r.id).length;
      const worksCount = WORKS.filter(w => w.researcher === r.id).length;

      // Composite Score Logic
      const score = Math.round((themeScore * 0.5) + (Math.min(30, kwMatch * 10)) + (Math.min(20, historyCount * 5)));

      return {
        ...r,
        score,
        mouExp: historyCount,
        works: worksCount,
        expBonus: historyCount // historical records
      };
    }).sort((a, b) => b.score - a.score).slice(0, 6);

    // 2. Recommend Groups (Top 4)
    const recommendedGroups = GROUPS.filter(g => 
      g.theme?.includes(theme) || g.theme === theme
    ).sort((a, b) => b.exp_score - a.exp_score).slice(0, 4);

    results.value = {
      researchers: topResearchers,
      groups: recommendedGroups,
      mouName: form.name || 'MOU ใหม่',
      themeData: THEMES[theme as keyof typeof THEMES]
    };
  };

  return { form, results, calculateFeasibility };
}
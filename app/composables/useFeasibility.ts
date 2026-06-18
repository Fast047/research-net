import { RESEARCHERS, GROUPS, THEMES, HISTORY, WORKS, rankForTheme } from '../utils/mockData';

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
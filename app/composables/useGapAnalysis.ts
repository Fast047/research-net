export const useGapAnalysis = () => {
  
  const gaps = computed(() => {
    return Object.keys(THEMES).map((t) => {
      // 1. Filter researchers with Alignment Score >= 65 for this theme
      const rs = RESEARCHERS.filter(r => (r.score_by_theme[t as keyof typeof r.score_by_theme] || 0) >= 65);
      
      const needed = THEMES[t as keyof typeof THEMES].mou_count;
      
      const coverage = Math.round(rs.length / Math.max(1, needed) * 100);
      
      // 4. Map status based on updated logic: 100%+ = ok, 60%+ = warn, <60% = gap
      let status: 'ok' | 'warn' | 'gap' = 'gap';
      if (coverage >= 100) status = 'ok';
      else if (coverage >= 60) status = 'warn';

      return {
        theme: t,
        name: THEMES[t as keyof typeof THEMES].name,
        icon: THEMES[t as keyof typeof THEMES].icon,
        researchers: rs.length,
        needed,
        coverage,
        status
      };
    });
  });
  return { gaps };
}
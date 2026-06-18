import { MOUS, RESEARCHERS, THEMES } from './mockData';

/**
 * Calculates the researcher coverage for a specific theme compared to active MOUs.
 * Provides metrics on qualified researchers versus strategic demand.
 */
export const getThemeCoverage = (themeKey: string) => {
  const mousInTheme = MOUS.filter(m => m.theme === themeKey).length;

  // Criteria: Researchers with thematic alignment score >= 65%
  const qualifiedResearchers = RESEARCHERS.filter((r: any) => {
    const scores = r.score_by_theme || {};
    return (scores[themeKey] || 0) >= 65;
  }).length;

  // Demand Calculation: Strategic target of 1.5 researchers per MOU, with a floor of 3
  const needed = Math.max(3, Math.ceil(mousInTheme * 1.5));
  const coverageValue = (qualifiedResearchers / needed) * 100;

  let status: 'ok' | 'warn' | 'gap' = 'ok';
  if (coverageValue < 50) status = 'gap';
  else if (coverageValue < 80) status = 'warn';

  return {
    theme: themeKey,
    name: (THEMES as any)[themeKey]?.name || themeKey,
    icon: (THEMES as any)[themeKey]?.icon || '📄',
    researchers: qualifiedResearchers,
    mous: mousInTheme,
    needed,
    coverage: Math.min(100, coverageValue),
    status
  };
};

/**
 * Generates a comprehensive gap report for all research themes.
 */
export const getGapReport = () => {
  return Object.keys(THEMES).map((theme) => getThemeCoverage(theme));
};

/**
 * Evaluates the risk of thematic saturation.
 * Saturation indicates that a theme has reached a high volume of MOUs and researchers,
 * suggesting resource dilution or a lack of room for significant new growth.
 */
export const getSaturationRisk = () => {
  return Object.keys(THEMES).map((themeKey) => {
    const coverageData = getThemeCoverage(themeKey);
    // Heuristic: Weight MOUs heavily as they drive administrative and research overhead
    const riskScore = (coverageData.mous * 12) + (coverageData.researchers * 2);

    return {
      theme: coverageData.name,
      risk: riskScore > 75 ? 'High' : riskScore > 45 ? 'Medium' : 'Low',
      score: riskScore,
    };
  });
};
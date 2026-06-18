/**
 * Partner Recommendation Engine
 * Provides logic for identifying strategic international partners and analyzing MOU distribution.
 */

/**
 * Recommends countries based on a research theme.
 * Prioritizes global leaders in the theme that do not currently have a strong MOU presence.
 */
export const recommendCountryForTheme = (theme: string): string[] => {
  const leadersByTheme: Record<string, string[]> = {
    'AI': ['Japan', 'USA', 'Singapore', 'China', 'South Korea'],
    'Medicine': ['UK', 'USA', 'Germany', 'Switzerland', 'Sweden'],
    'Agriculture': ['Netherlands', 'Australia', 'Japan', 'Israel', 'Vietnam'],
    'Engineering': ['Germany', 'Japan', 'USA', 'South Korea', 'Taiwan'],
    'Digital': ['USA', 'Estonia', 'Singapore', 'Finland', 'Japan'],
    'Social': ['UK', 'France', 'Canada', 'Australia']
  };

  // Access global MOUS data (assumed to be available in project context)
  const existingCountries = new Set(
    (typeof MOUS !== 'undefined' ? MOUS : []).filter((m: any) => m.theme === theme).map((m: any) => m.country)
  );

  const recommendations = leadersByTheme[theme] || ['Japan', 'USA', 'UK'];
  
  // Sort recommendations: prioritize countries we don't have an existing MOU with
  return [...recommendations].sort((a, b) => {
    const hasA = existingCountries.has(a) ? 1 : 0;
    const hasB = existingCountries.has(b) ? 1 : 0;
    return hasA - hasB;
  });
};

/**
 * Analyzes global coverage of existing MOUs compared to strategic target countries.
 */
export const getCountryCoverage = () => {
  const mous = typeof MOUS !== 'undefined' ? MOUS : [];
  const activeCountries = Array.from(new Set(mous.map((m: any) => m.country)));
  const globalTargets = [
    'Japan', 'USA', 'UK', 'Germany', 'China', 'South Korea', 
    'Singapore', 'Australia', 'Netherlands', 'France', 'Switzerland', 'Canada'
  ];

  const covered = globalTargets.filter(c => activeCountries.includes(c));
  const missing = globalTargets.filter(c => !activeCountries.includes(c));

  return {
    covered,
    missing,
    percentage: globalTargets.length ? Math.round((covered.length / globalTargets.length) * 100) : 0
  };
};

/**
 * Identifies the most suitable institution for a partnership based on theme and country.
 */
export const findBestPartnerInstitution = (theme: string, country: string): string | null => {
  const mous = typeof MOUS !== 'undefined' ? MOUS : [];
  const candidates = mous.filter((m: any) => m.theme === theme && m.country === country);
  
  if (candidates.length > 0) {
    // Return the partner institution with the highest budget involvement as a primary candidate
    return candidates.sort((a: any, b: any) => (b.budget || 0) - (a.budget || 0))[0]?.inst || null;
  }
  return null;
};

/**
 * Calculates a diversity score (0-100) based on geographical and thematic spread.
 */
export const getMOUDiversityScore = (): number => {
  const mous = typeof MOUS !== 'undefined' ? MOUS : [];
  const themes = typeof THEMES !== 'undefined' ? THEMES : {};
  if (mous.length === 0) return 0;

  const uniqueCountries = new Set(mous.map((m: any) => m.country)).size;
  const uniqueThemes = new Set(mous.map((m: any) => m.theme)).size;
  const themeCount = Object.keys(themes).length || 1;
  
  const countryWeight = Math.min(1, uniqueCountries / 10) * 50;
  const themeWeight = Math.min(1, uniqueThemes / themeCount) * 50;

  return Math.round(countryWeight + themeWeight);
};
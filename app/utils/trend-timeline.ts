import { MOUS, PROJECTS, WORKS } from './mockData';

/**
 * Aggregates research activities (MOUs, Projects, Works) by year.
 * Provides a breakdown for charting and timeline analysis.
 */
export const getActivityTimeline = (yearRange: number = 5) => {
  const maxYearInSeries = [
    ...MOUS.map(m => m.year),
    ...PROJECTS.map(p => parseInt(p.year)),
    ...WORKS.map(w => w.year)
  ].filter(y => !isNaN(y));
  
  const currentYear = maxYearInSeries.length > 0 ? Math.max(...maxYearInSeries) : 2567;
  const startYear = currentYear - yearRange + 1;
  const years = Array.from({ length: yearRange }, (_, i) => startYear + i);

  return years.map(year => {
    const mous = MOUS.filter(m => m.year === year).length;
    const projects = PROJECTS.filter(p => parseInt(p.year) === year).length;
    const works = WORKS.filter(w => w.year === year).length;

    return {
      year,
      mous,
      projects,
      works,
      total: mous + projects + works
    };
  });
};

/**
 * Calculates the year-over-year growth rate based on the last two years of data.
 */
export const getGrowthRate = () => {
  const timeline = getActivityTimeline(2); 
  const prev = timeline[0]?.total || 0;
  const current = timeline[1]?.total || 0;

  if (prev === 0) return current > 0 ? 100 : 0;
  return parseFloat(((current - prev) / prev * 100).toFixed(1));
};

/**
 * Estimates future research activity levels using a simple linear trend analysis of the last 3 years.
 */
export const getFutureProjection = (projectionYears: number = 3) => {
  const history = getActivityTimeline(3); 
  if (history.length < 2) return [];
  
  const startTotal = history[0]?.total ?? 0;
  const endTotal = history[history.length - 1]?.total || 0;
  const growthPerYear = (endTotal - startTotal) / (history.length - 1);

  const lastYear = history[history.length - 1]?.year || new Date().getFullYear();
  
  return Array.from({ length: projectionYears }, (_, i) => {
    const year = lastYear + i + 1;
    return {
      year,
      estimatedActivities: Math.round(endTotal + (growthPerYear * (i + 1)))
    };
  });
};

import { RESEARCHERS } from './mockData';

/**
 * Benchmark requirements for each research theme.
 * In a production environment, this might be fetched from a configuration database.
 */
const THEMATIC_REQUIREMENTS: Record<string, string[]> = {
  'AI': ['Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Edge AI', 'Generative AI'],
  'Health': ['Genomics', 'Epidemiology', 'Clinical Trials', 'Proteomics', 'Digital Health'],
  'Energy': ['Hydrogen Storage', 'Smart Grids', 'Solid State Batteries', 'Bio-energy'],
  'Env': ['Carbon Capture', 'Microplastics', 'Climate Modeling', 'Waste-to-Energy'],
  'Agri': ['Precision Farming', 'Soil Microbiome', 'Hydroponics', 'Pest Informatics'],
  'Social': ['Behavioral Economics', 'Urban Sociology', 'Policy Analysis', 'Digital Ethics'],
  'Nano': ['Quantum Dots', 'Graphene Synthesis', 'Molecular Electronics'],
  'Quantum': ['Quantum Computing', 'Quantum Cryptography', 'Quantum Sensing']
};

/**
 * Returns a list of expertise that is currently missing within a specific theme 
 * based on the current researchers' skills.
 * 
 * @param theme - The theme ID (e.g., 'AI', 'Health')
 */
export const getMissingExpertise = (theme: string): string[] => {
  const requirements = THEMATIC_REQUIREMENTS[theme] || [];
  
  // Get all unique expertise currently present in researchers associated with this theme
  const availableExpertise = new Set(
    RESEARCHERS
      .filter((r:any) => r.themes?.includes(theme))
      .flatMap((r:any) => r.expertise || [])
  );

  return requirements.filter(skill => !availableExpertise.has(skill));
};

/**
 * Generates a comprehensive report of skill gaps across all defined research themes.
 */
export const getSkillGapReport = () => {
  return Object.keys(THEMATIC_REQUIREMENTS).map(theme => {
    const missing = getMissingExpertise(theme);
    const requiredCount = THEMATIC_REQUIREMENTS[theme]?.length ?? 0;
    const missingCount = missing.length;
    
    return {
      theme,
      missing,
      missingCount,
      coverage: Math.round(((requiredCount - missingCount) / requiredCount) * 100),
      priority: missingCount > 2 ? 'High' : (missingCount > 0 ? 'Medium' : 'Low')
    };
  });
};

/**
 * Searches the entire researcher database for individuals who possess a specific expertise.
 * This is useful for identifying internal talent that can fill gaps in other themes.
 * 
 * @param expertise - The specific expertise string to search for
 */
export const findResearchersForGap = (expertise: string) => {
  return RESEARCHERS.filter(r => 
    r.expertise?.some((e: string) => e.toLowerCase() === expertise.toLowerCase())
  );
};
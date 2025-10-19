export interface QuantifiedAchievement {
  original: string;
  quantified: string;
}

export interface AnalysisReport {
  atsScore: number;
  atsExplanation: string;
  keywordSuggestions: string[];
  quantifiedAchievements: QuantifiedAchievement[];
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
}

import { Job } from './job.model';

/**
 * MatchResult — mirrors the backend MatchResult DTO.
 */
export interface MatchResult {
  job: Job;
  totalScore: number;
  skillScore: number;
  gpaScore: number;
  authScore: number;
  confidence: ConfidenceLevel;
  profileCompleteness: number;
  breakdown: ScoreBreakdown;
  matchSummary: string;
  rank: number;
  scoreTier: ScoreTier;
}

/**
 * ScoreBreakdown — detailed explainability data.
 */
export interface ScoreBreakdown {
  // Skill breakdown
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  missingPreferredSkills: string[];
  skillExplanation: string;
  jaccardSimilarity: number;

  // GPA breakdown
  studentGpa: number;
  requiredGpa: number;
  gpaDelta: number;
  gpaExplanation: string;

  // Auth breakdown
  studentAuth: string;
  jobAuthRequired: string;
  sponsorshipAvailable: boolean;
  authExplanation: string;

  // Improvement
  improvementTips: string[];
  tipImpacts: string[];
}

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ScoreTier = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'LOW';

/** Color mapping for score tiers */
export const TIER_COLORS: Record<string, string> = {
  EXCELLENT: '#10b981',
  GOOD: '#06b6d4',
  FAIR: '#f59e0b',
  LOW: '#f43f5e',
};

/** Color mapping for confidence levels */
export const CONFIDENCE_COLORS: Record<string, string> = {
  HIGH: '#10b981',
  MEDIUM: '#f59e0b',
  LOW: '#f43f5e',
};

/**
 * Returns the gradient CSS for a given score (0-100).
 */
export function getScoreGradient(score: number): string {
  if (score >= 80) return 'linear-gradient(135deg, #10b981, #06b6d4)';
  if (score >= 60) return 'linear-gradient(135deg, #06b6d4, #7c3aed)';
  if (score >= 40) return 'linear-gradient(135deg, #f59e0b, #f97316)';
  return 'linear-gradient(135deg, #f43f5e, #e11d48)';
}

/**
 * Returns a color for a given score.
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#06b6d4';
  if (score >= 40) return '#f59e0b';
  return '#f43f5e';
}

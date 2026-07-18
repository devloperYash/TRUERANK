/**
 * Job model — mirrors the backend Job entity.
 */
export interface Job {
  id: number;
  title: string;
  company: string;
  companyLogoUrl: string;
  location: string;
  jobType: JobType;
  requiredSkills: string;
  preferredSkills: string;
  minGpa: number;
  workAuthRequired: string;
  sponsorshipAvailable: boolean;
  description: string;
  salary: string;
  postedDate: string;
  deadline: string;
  workMode: WorkMode;
  openings: number;
}

/** Work mode types */
export type WorkMode = 'REMOTE' | 'ONSITE' | 'HYBRID';

/** Job type enum */
export type JobType = 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME' | 'CO_OP';

/** Readable labels */
export const JOB_TYPE_LABELS: Record<string, string> = {
  INTERNSHIP: 'Internship',
  FULL_TIME: 'Full-Time',
  PART_TIME: 'Part-Time',
  CO_OP: 'Co-Op',
};

/** Badge colors for job types */
export const JOB_TYPE_COLORS: Record<string, string> = {
  INTERNSHIP: '#7c3aed',
  FULL_TIME: '#06b6d4',
  PART_TIME: '#f59e0b',
  CO_OP: '#10b981',
};

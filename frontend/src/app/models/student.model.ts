/**
 * Student model — mirrors the backend Student entity.
 */
export interface Student {
  id: number;
  name: string;
  email: string;
  university: string;
  major: string;
  gpa: number;
  graduationYear: number;
  skills: string;
  strongSkills: string;
  workAuthorization: string;
  profileImageUrl: string;
  resumeUrl: string;
  bio: string;
  appliedJobIds?: number[];
}

/** Work authorization types */
export type WorkAuth =
  | 'US_CITIZEN'
  | 'PERMANENT_RESIDENT'
  | 'F1_OPT'
  | 'F1_CPT'
  | 'H1B'
  | 'OTHER';

/** Readable labels for work authorization */
export const WORK_AUTH_LABELS: Record<string, string> = {
  US_CITIZEN: 'US Citizen',
  PERMANENT_RESIDENT: 'Permanent Resident',
  F1_OPT: 'F1-OPT',
  F1_CPT: 'F1-CPT',
  H1B: 'H1-B Visa',
  ANY: 'Any',
  OTHER: 'Other',
};

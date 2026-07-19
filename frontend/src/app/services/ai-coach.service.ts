import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Response DTO for AI-generated career tips.
 */
export interface AiTipsResponse {
  tips: string;
  planAvailable: boolean;
  generatedAt: string;
  source: 'GEMINI_AI' | 'RULE_BASED';
}

/**
 * Response DTO for AI-generated action plan.
 */
export interface AiActionPlan {
  title: string;
  summary: string;
  weeks: PlanWeek[];
  resources: string[];
  estimatedTimeHours: number;
  generatedAt: string;
  source: string;
}

export interface PlanWeek {
  weekNumber: number;
  theme: string;
  goals: string[];
  tasks: string[];
}

/**
 * Service for AI Coach API communication.
 * Connects to the Gemini AI-powered career coaching backend.
 */
@Injectable({ providedIn: 'root' })
export class AiCoachService {
  private readonly apiUrl = `${environment.apiUrl}/ai-coach`;

  constructor(private http: HttpClient) {}

  /**
   * Get AI-generated career tips for a student-job match.
   */
  getAiTips(studentId: number, jobId: number): Observable<AiTipsResponse> {
    return this.http.get<AiTipsResponse>(
      `${this.apiUrl}/${studentId}/job/${jobId}/tips`
    );
  }

  /**
   * Generate a structured action plan using Gemini AI.
   */
  generateActionPlan(studentId: number, jobId: number): Observable<AiActionPlan> {
    return this.http.post<AiActionPlan>(
      `${this.apiUrl}/${studentId}/job/${jobId}/plan`, {}
    );
  }
}

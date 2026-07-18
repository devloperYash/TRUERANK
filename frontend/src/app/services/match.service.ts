import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchResult } from '../models/match.model';

/**
 * Service for Match API communication — the core of TrueRank.
 */
@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly apiUrl = 'http://localhost:8080/api/matches';

  constructor(private http: HttpClient) {}

  /**
   * Get ranked matches for a student.
   */
  getMatches(studentId: number): Observable<MatchResult[]> {
    return this.http.get<MatchResult[]>(`${this.apiUrl}/${studentId}`);
  }

  /**
   * Get match detail for a specific student-job pair.
   */
  getMatchDetail(studentId: number, jobId: number): Observable<MatchResult> {
    return this.http.get<MatchResult>(`${this.apiUrl}/${studentId}/job/${jobId}`);
  }

  /**
   * Compare multiple jobs for a student.
   */
  compareJobs(studentId: number, jobIds: number[]): Observable<MatchResult[]> {
    const params = new HttpParams().set('jobIds', jobIds.join(','));
    return this.http.get<MatchResult[]>(`${this.apiUrl}/${studentId}/compare`, { params });
  }
}

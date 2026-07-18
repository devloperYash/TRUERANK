import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';

/**
 * Service for Job API communication.
 */
@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly apiUrl = 'http://localhost:8080/api/jobs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  filter(params: {
    type?: string;
    location?: string;
    skill?: string;
    company?: string;
  }): Observable<Job[]> {
    let httpParams = new HttpParams();
    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.location) httpParams = httpParams.set('location', params.location);
    if (params.skill) httpParams = httpParams.set('skill', params.skill);
    if (params.company) httpParams = httpParams.set('company', params.company);

    return this.http.get<Job[]>(`${this.apiUrl}/filter`, { params: httpParams });
  }
}

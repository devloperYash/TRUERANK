import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { StudentService } from '../../services/student.service';
import { MatchResult } from '../../models/match.model';
import { Student } from '../../models/student.model';
import { JOB_TYPE_LABELS } from '../../models/job.model';
import { ScoreRingComponent } from '../../components/score-ring/score-ring.component';
import { RadarChartComponent } from '../../components/radar-chart/radar-chart.component';
import { ScoreDnaStripComponent } from '../../components/score-dna-strip/score-dna-strip.component';
import { ScoreBreakdownComponent } from '../../components/score-breakdown/score-breakdown.component';
import { ConfidenceBadgeComponent } from '../../components/confidence-badge/confidence-badge.component';

/**
 * JobDetailPage — Full job information with radar chart,
 * detailed score breakdown, and improvement tips.
 */
@Component({
  selector: 'tr-job-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    ScoreRingComponent, RadarChartComponent, ScoreDnaStripComponent,
    ScoreBreakdownComponent, ConfidenceBadgeComponent
  ],
  template: `
    <div class="page-content">
      <div class="container" *ngIf="match">
        <!-- Back Button -->
        <a routerLink="/dashboard" class="back-link animate-fade-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Dashboard
        </a>

        <div class="detail-layout">
          <!-- Left Column: Job Info + Breakdown -->
          <div class="detail-main">
            <!-- Job Header -->
            <div class="job-header glass-card animate-fade-in-up">
              <div class="job-header-top">
                <div>
                  <div class="company-row">
                    <span class="company-label">{{ match.job.company }}</span>
                    <span class="type-badge"
                          [style.background]="getTypeColor(match.job.jobType) + '15'"
                          [style.color]="getTypeColor(match.job.jobType)">
                      {{ getTypeLabel(match.job.jobType) }}
                    </span>
                    <span class="type-badge" *ngIf="match.job.workMode"
                          style="background: rgba(255,255,255,0.1); color: #fff; margin-left: 4px;">
                      {{ match.job.workMode }}
                    </span>
                    <tr-confidence-badge [level]="match.confidence"></tr-confidence-badge>
                  </div>
                  <h1 class="job-title">{{ match.job.title }}</h1>
                  
                  <div class="apply-actions mt-4" style="margin-top: 16px;">
                    <button *ngIf="!hasApplied" class="btn btn-primary" (click)="applyForJob()" [disabled]="isApplying">
                      {{ isApplying ? 'Applying...' : 'Apply Now' }}
                    </button>
                    <button *ngIf="hasApplied" class="btn btn-secondary" disabled>
                      ✓ Applied
                    </button>
                  </div>
                </div>
                <tr-score-ring
                  [score]="match.totalScore"
                  [size]="120"
                  [strokeWidth]="8"
                  label="MATCH"
                ></tr-score-ring>
              </div>

              <div class="job-meta">
                <span class="meta-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ match.job.location }}
                </span>
                <span class="meta-chip" *ngIf="match.job.salary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                  {{ match.job.salary }}
                </span>
                <span class="meta-chip" *ngIf="match.job.openings">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  {{ match.job.openings }} openings
                </span>
                <span class="meta-chip" *ngIf="match.job.deadline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Deadline: {{ match.job.deadline | date:'mediumDate' }}
                </span>
              </div>

              <!-- DNA Strip -->
              <tr-score-dna-strip
                [skillScore]="match.skillScore"
                [gpaScore]="match.gpaScore"
                [authScore]="match.authScore"
                [showLegend]="true"
              ></tr-score-dna-strip>

              <!-- Match Summary -->
              <div class="match-summary" *ngIf="match.matchSummary">
                <p>{{ match.matchSummary }}</p>
              </div>
            </div>

            <!-- Job Description -->
            <div class="job-description glass-card animate-fade-in-up stagger-2">
              <h3>About This Role</h3>
              <p>{{ match.job.description }}</p>
            </div>

            <!-- Score Breakdown -->
            <div class="breakdown-panel animate-fade-in-up stagger-3">
              <h3 class="section-heading">Why This Score?</h3>
              <p class="section-subheading">Detailed breakdown of how your match score was calculated</p>
              <tr-score-breakdown
                [breakdown]="match.breakdown"
                [skillScore]="match.skillScore"
                [gpaScore]="match.gpaScore"
                [authScore]="match.authScore"
              ></tr-score-breakdown>
            </div>
          </div>

          <!-- Right Column: Radar + Quick Stats -->
          <div class="detail-sidebar">
            <div class="radar-card glass-card animate-fade-in-up stagger-2">
              <h4 class="sidebar-title">Match Radar</h4>
              <div class="radar-wrapper">
                <tr-radar-chart
                  [size]="240"
                  [skillScore]="match.skillScore"
                  [gpaScore]="match.gpaScore"
                  [authScore]="match.authScore"
                  [overallScore]="match.totalScore"
                ></tr-radar-chart>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats glass-card animate-fade-in-up stagger-3">
              <h4 class="sidebar-title">Quick Stats</h4>
              <div class="stat-row">
                <span class="stat-label">Rank</span>
                <span class="stat-value rank-value">#{{ match.rank }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Tier</span>
                <span class="stat-value" [style.color]="getTierColor()">{{ match.scoreTier }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Skills Matched</span>
                <span class="stat-value">{{ match.breakdown?.matchedSkills?.length || 0 }} / {{ (match.breakdown?.matchedSkills?.length || 0) + (match.breakdown?.missingSkills?.length || 0) }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">GPA Delta</span>
                <span class="stat-value" [style.color]="(match.breakdown?.gpaDelta || 0) >= 0 ? '#10b981' : '#f43f5e'">
                  {{ (match.breakdown?.gpaDelta || 0) >= 0 ? '+' : '' }}{{ match.breakdown?.gpaDelta | number:'1.2-2' }}
                </span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Sponsorship</span>
                <span class="stat-value" [style.color]="match.breakdown?.sponsorshipAvailable ? '#10b981' : '#f43f5e'">
                  {{ match.breakdown?.sponsorshipAvailable ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div class="container" *ngIf="!match && !error">
        <div class="skeleton skeleton-title" style="width: 300px"></div>
        <div class="skeleton skeleton-text" style="width: 200px; margin-top: 12px"></div>
      </div>

      <!-- Error -->
      <div class="container error-state" *ngIf="error">
        <h3>Failed to load job details</h3>
        <p>{{ error }}</p>
        <a routerLink="/dashboard" class="btn btn-primary">Back to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      color: var(--text-tertiary);
      margin-bottom: 20px;
      transition: color 200ms;
    }
    .back-link:hover { color: var(--text-primary); }

    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 24px;
      align-items: start;
    }

    .detail-main {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Job Header */
    .job-header {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .job-header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .company-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .company-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .type-badge {
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .job-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: 9999px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .match-summary {
      padding: 14px 18px;
      background: rgba(124,58,237,0.04);
      border-left: 3px solid var(--accent-violet);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    .match-summary p {
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0;
    }

    /* Description */
    .job-description {
      padding: 24px;
    }
    .job-description h3 { margin-bottom: 12px; }
    .job-description p { font-size: 0.9375rem; line-height: 1.8; }

    /* Breakdown */
    .section-heading {
      font-size: 1.25rem;
      margin-bottom: 4px;
    }
    .section-subheading {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      margin-bottom: 16px;
    }

    /* Sidebar */
    .detail-sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: sticky;
      top: calc(var(--navbar-height) + 24px);
    }

    .sidebar-title {
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-bottom: 16px;
    }

    .radar-card {
      padding: 20px;
    }

    .radar-wrapper {
      display: flex;
      justify-content: center;
    }

    .quick-stats {
      padding: 20px;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-glass);
    }
    .stat-row:last-child { border-bottom: none; }

    .stat-label {
      font-size: 0.8125rem;
      color: var(--text-tertiary);
    }

    .stat-value {
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .rank-value {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .error-state {
      text-align: center;
      padding: 64px 0;
    }

    @media (max-width: 900px) {
      .detail-layout { grid-template-columns: 1fr; }
      .detail-sidebar { position: static; }
      .job-header-top { flex-direction: column; gap: 16px; }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  match: MatchResult | null = null;
  student: Student | null = null;
  error: string = '';
  isApplying = false;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (jobId) {
      this.matchService.getMatchDetail(1, jobId).subscribe({
        next: (result) => { this.match = result; },
        error: (err) => { this.error = 'Could not load match data. Is the backend running?'; },
      });
      this.studentService.getById(1).subscribe({
        next: (s) => { this.student = s; }
      });
    }
  }

  get hasApplied(): boolean {
    if (!this.student || !this.match || !this.student.appliedJobIds) return false;
    return this.student.appliedJobIds.includes(this.match.job.id);
  }

  applyForJob(): void {
    if (!this.match || this.hasApplied) return;
    this.isApplying = true;
    this.studentService.applyForJob(1, this.match.job.id).subscribe({
      next: (updatedStudent) => {
        this.student = updatedStudent;
        this.isApplying = false;
      },
      error: () => {
        this.isApplying = false;
      }
    });
  }

  getTypeLabel(type: string): string {
    return JOB_TYPE_LABELS[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      INTERNSHIP: '#7c3aed',
      FULL_TIME: '#06b6d4',
      PART_TIME: '#f59e0b',
      CO_OP: '#10b981',
    };
    return colors[type] || '#7c3aed';
  }

  getTierColor(): string {
    const tier = this.match?.scoreTier || '';
    const colors: Record<string, string> = {
      EXCELLENT: '#10b981',
      GOOD: '#06b6d4',
      FAIR: '#f59e0b',
      LOW: '#f43f5e',
    };
    return colors[tier] || '#7c3aed';
  }
}

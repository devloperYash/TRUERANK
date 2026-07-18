import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { MatchResult } from '../../models/match.model';
import { ScoreRingComponent } from '../../components/score-ring/score-ring.component';
import { RadarChartComponent } from '../../components/radar-chart/radar-chart.component';
import { SkillPillsComponent } from '../../components/skill-pills/skill-pills.component';
import { ScoreDnaStripComponent } from '../../components/score-dna-strip/score-dna-strip.component';
import { ConfidenceBadgeComponent } from '../../components/confidence-badge/confidence-badge.component';

/**
 * ComparePage — Side-by-side comparison of 2-3 selected jobs
 * with visual diff highlighting.
 */
@Component({
  selector: 'tr-compare',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    ScoreRingComponent, RadarChartComponent, SkillPillsComponent,
    ScoreDnaStripComponent, ConfidenceBadgeComponent
  ],
  template: `
    <div class="page-content">
      <div class="container">
        <a routerLink="/dashboard" class="back-link animate-fade-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Dashboard
        </a>

        <div class="compare-header animate-fade-in-up">
          <h1>Compare Matches</h1>
          <p class="text-muted">Side-by-side comparison of selected jobs</p>
        </div>

        <!-- No jobs selected -->
        <div class="empty-compare" *ngIf="!isLoading && matches.length === 0">
          <div class="empty-icon">📊</div>
          <h3>No jobs selected for comparison</h3>
          <p>Go to the Dashboard and select 2-3 jobs using the "Compare" button on each card.</p>
          <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
        </div>

        <!-- Comparison Table -->
        <div class="compare-grid" *ngIf="matches.length > 0" [style.gridTemplateColumns]="'200px repeat(' + matches.length + ', 1fr)'">

          <!-- HEADER ROW: Score Rings -->
          <div class="compare-label header-label">Overall Score</div>
          <div *ngFor="let m of matches" class="compare-cell header-cell animate-fade-in-up" [style.animationDelay.ms]="matches.indexOf(m) * 100">
            <div class="compare-job-header">
              <tr-score-ring [score]="m.totalScore" [size]="90" [strokeWidth]="6" label="MATCH"></tr-score-ring>
              <h3 class="compare-job-title">{{ m.job.title }}</h3>
              <span class="compare-company">{{ m.job.company }}</span>
              <tr-confidence-badge [level]="m.confidence"></tr-confidence-badge>
            </div>
          </div>

          <!-- DNA Strip Row -->
          <div class="compare-label">Score Composition</div>
          <div *ngFor="let m of matches" class="compare-cell">
            <tr-score-dna-strip [skillScore]="m.skillScore" [gpaScore]="m.gpaScore" [authScore]="m.authScore"></tr-score-dna-strip>
          </div>

          <!-- Skill Score Row -->
          <div class="compare-label">
            <span class="dim-icon" style="color: #a78bfa">⬤</span>
            Skill Score
          </div>
          <div *ngFor="let m of matches" class="compare-cell">
            <span class="compare-score" [style.color]="getColor(m.skillScore)"
                  [class.best]="isBestInDim(m, 'skill')">
              {{ m.skillScore | number:'1.0-0' }}%
            </span>
            <span class="compare-detail">
              {{ m.breakdown?.matchedSkills?.length || 0 }}/{{ (m.breakdown?.matchedSkills?.length || 0) + (m.breakdown?.missingSkills?.length || 0) }} skills matched
            </span>
          </div>

          <!-- GPA Score Row -->
          <div class="compare-label">
            <span class="dim-icon" style="color: #22d3ee">⬤</span>
            GPA Score
          </div>
          <div *ngFor="let m of matches" class="compare-cell">
            <span class="compare-score" [style.color]="getColor(m.gpaScore)"
                  [class.best]="isBestInDim(m, 'gpa')">
              {{ m.gpaScore | number:'1.0-0' }}%
            </span>
            <span class="compare-detail">
              Req: {{ m.breakdown?.requiredGpa | number:'1.1-1' }} (Δ{{ (m.breakdown?.gpaDelta ?? 0) >= 0 ? '+' : '' }}{{ m.breakdown?.gpaDelta | number:'1.2-2' }})
            </span>
          </div>

          <!-- Auth Score Row -->
          <div class="compare-label">
            <span class="dim-icon" style="color: #34d399">⬤</span>
            Auth Score
          </div>
          <div *ngFor="let m of matches" class="compare-cell">
            <span class="compare-score" [style.color]="getColor(m.authScore)"
                  [class.best]="isBestInDim(m, 'auth')">
              {{ m.authScore | number:'1.0-0' }}%
            </span>
            <span class="compare-detail">
              {{ m.breakdown?.sponsorshipAvailable ? '✓ Sponsorship' : '✕ No Sponsorship' }}
            </span>
          </div>

          <!-- Location Row -->
          <div class="compare-label">Location</div>
          <div *ngFor="let m of matches" class="compare-cell">
            <span class="compare-text">{{ m.job.location }}</span>
          </div>

          <!-- Salary Row -->
          <div class="compare-label">Salary</div>
          <div *ngFor="let m of matches" class="compare-cell">
            <span class="compare-text">{{ m.job.salary || 'Not disclosed' }}</span>
          </div>

          <!-- Type Row -->
          <div class="compare-label">Type</div>
          <div *ngFor="let m of matches" class="compare-cell">
            <span class="compare-text">{{ getTypeLabel(m.job.jobType) }}</span>
          </div>

          <!-- Openings Row -->
          <div class="compare-label">Openings</div>
          <div *ngFor="let m of matches" class="compare-cell">
            <span class="compare-text">{{ m.job.openings || '—' }}</span>
          </div>

          <!-- Matched Skills Row -->
          <div class="compare-label">Matched Skills</div>
          <div *ngFor="let m of matches" class="compare-cell skills-cell">
            <tr-skill-pills
              [matchedSkills]="m.breakdown?.matchedSkills || []"
              [bonusSkills]="m.breakdown?.bonusSkills || []"
            ></tr-skill-pills>
          </div>

          <!-- Missing Skills Row -->
          <div class="compare-label">Missing Skills</div>
          <div *ngFor="let m of matches" class="compare-cell skills-cell">
            <tr-skill-pills
              [missingSkills]="m.breakdown?.missingSkills || []"
            ></tr-skill-pills>
          </div>

          <!-- Actions Row -->
          <div class="compare-label">Actions</div>
          <div *ngFor="let m of matches" class="compare-cell">
            <a [routerLink]="['/job', m.job.id]" class="btn btn-primary btn-sm">View Details →</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .compare-header {
      margin-bottom: 32px;
    }
    .compare-header h1 { margin-bottom: 4px; }

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

    .empty-compare {
      text-align: center;
      padding: 80px 0;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 16px; }
    .empty-compare h3 { margin-bottom: 8px; }
    .empty-compare p { color: var(--text-tertiary); margin-bottom: 24px; }

    /* Comparison Grid */
    .compare-grid {
      display: grid;
      gap: 0;
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .compare-label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 20px;
      background: rgba(255,255,255,0.015);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-tertiary);
      border-bottom: 1px solid var(--border-glass);
      border-right: 1px solid var(--border-glass);
    }

    .header-label {
      background: rgba(124,58,237,0.03);
    }

    .dim-icon {
      font-size: 0.5rem;
    }

    .compare-cell {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid var(--border-glass);
      border-right: 1px solid var(--border-glass);
    }

    .compare-cell:last-child {
      border-right: none;
    }

    .header-cell {
      background: rgba(124,58,237,0.02);
      padding: 24px 20px;
    }

    .compare-job-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .compare-job-title {
      font-size: 1rem;
      margin: 0;
      text-align: center;
    }

    .compare-company {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .compare-score {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .compare-score.best {
      position: relative;
    }

    .compare-score.best::after {
      content: '★';
      position: absolute;
      top: -8px;
      right: -14px;
      font-size: 0.625rem;
      color: #eab308;
    }

    .compare-detail {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .compare-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .skills-cell {
      align-items: flex-start;
    }

    @media (max-width: 768px) {
      .compare-grid {
        overflow-x: auto;
        display: block;
      }
    }
  `]
})
export class CompareComponent implements OnInit {
  matches: MatchResult[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService
  ) {}

  ngOnInit(): void {
    const jobIdsParam = this.route.snapshot.queryParamMap.get('jobs');
    if (jobIdsParam) {
      const jobIds = jobIdsParam.split(',').map(Number).filter(n => !isNaN(n));
      if (jobIds.length >= 2) {
        this.matchService.compareJobs(1, jobIds).subscribe({
          next: (results) => {
            this.matches = results;
            this.isLoading = false;
          },
          error: () => { this.isLoading = false; },
        });
      } else {
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
    }
  }

  getColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#06b6d4';
    if (score >= 40) return '#f59e0b';
    return '#f43f5e';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      INTERNSHIP: 'Internship', FULL_TIME: 'Full-Time',
      PART_TIME: 'Part-Time', CO_OP: 'Co-Op'
    };
    return labels[type] || type;
  }

  isBestInDim(match: MatchResult, dim: string): boolean {
    if (this.matches.length < 2) return false;
    const getValue = (m: MatchResult) => {
      switch (dim) {
        case 'skill': return m.skillScore;
        case 'gpa': return m.gpaScore;
        case 'auth': return m.authScore;
        default: return m.totalScore;
      }
    };
    const max = Math.max(...this.matches.map(getValue));
    return getValue(match) === max && this.matches.filter(m => getValue(m) === max).length === 1;
  }
}

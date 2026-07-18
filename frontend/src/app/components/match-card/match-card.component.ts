import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchResult } from '../../models/match.model';
import { JOB_TYPE_LABELS, JOB_TYPE_COLORS } from '../../models/job.model';
import { ScoreRingComponent } from '../score-ring/score-ring.component';
import { ScoreDnaStripComponent } from '../score-dna-strip/score-dna-strip.component';
import { ConfidenceBadgeComponent } from '../confidence-badge/confidence-badge.component';

/**
 * MatchCardComponent — Glassmorphism card displaying a job match
 * with score ring, DNA strip, and key info.
 */
@Component({
  selector: 'tr-match-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ScoreRingComponent, ScoreDnaStripComponent, ConfidenceBadgeComponent],
  template: `
    <div class="match-card glass-card" [class.selected]="isSelected" (click)="onCardClick()">
      <!-- Rank Badge -->
      <div class="rank-badge" [class.top-rank]="match.rank <= 3">
        <span class="rank-number">#{{ match.rank }}</span>
      </div>

      <div class="card-body">
        <!-- Left: Info -->
        <div class="card-info">
          <div class="card-header">
            <div class="company-row">
              <span class="company-name">{{ match.job.company }}</span>
              <span class="job-type-badge"
                    [style.background]="getTypeColor(match.job.jobType) + '15'"
                    [style.color]="getTypeColor(match.job.jobType)"
                    [style.borderColor]="getTypeColor(match.job.jobType) + '30'">
                {{ getTypeLabel(match.job.jobType) }}
              </span>
            </div>
            <h3 class="job-title">{{ match.job.title }}</h3>
            <div class="meta-row">
              <span class="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {{ match.job.location }}
              </span>
              <span class="meta-item" *ngIf="match.job.salary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
                {{ match.job.salary }}
              </span>
            </div>
          </div>

          <!-- Mini Breakdown -->
          <div class="mini-scores">
            <div class="mini-score">
              <span class="mini-label">Skills</span>
              <span class="mini-value" [style.color]="getColor(match.skillScore)">{{ match.skillScore | number:'1.0-0' }}</span>
            </div>
            <div class="mini-divider"></div>
            <div class="mini-score">
              <span class="mini-label">GPA</span>
              <span class="mini-value" [style.color]="getColor(match.gpaScore)">{{ match.gpaScore | number:'1.0-0' }}</span>
            </div>
            <div class="mini-divider"></div>
            <div class="mini-score">
              <span class="mini-label">Auth</span>
              <span class="mini-value" [style.color]="getColor(match.authScore)">{{ match.authScore | number:'1.0-0' }}</span>
            </div>
          </div>

          <!-- DNA Strip -->
          <tr-score-dna-strip
            [skillScore]="match.skillScore"
            [gpaScore]="match.gpaScore"
            [authScore]="match.authScore"
          ></tr-score-dna-strip>

          <!-- Footer -->
          <div class="card-footer">
            <tr-confidence-badge [level]="match.confidence"></tr-confidence-badge>
            <div class="card-actions">
              <button class="btn btn-ghost btn-sm" (click)="toggleCompare($event)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                {{ isSelected ? 'Remove' : 'Compare' }}
              </button>
              <a [routerLink]="['/job', match.job.id]" class="btn btn-primary btn-sm"
                 (click)="$event.stopPropagation()">
                View Details →
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Score Ring -->
        <div class="card-score">
          <tr-score-ring
            [score]="match.totalScore"
            [size]="100"
            [strokeWidth]="6"
            label="MATCH"
          ></tr-score-ring>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .match-card {
      position: relative;
      padding: 20px;
      cursor: pointer;
    }

    .match-card.selected {
      border-color: var(--accent-violet) !important;
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.15);
    }

    .rank-badge {
      position: absolute;
      top: -8px;
      left: 16px;
      padding: 2px 10px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-full);
      z-index: 1;
    }

    .rank-badge.top-rank {
      background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2));
      border-color: rgba(124, 58, 237, 0.3);
    }

    .rank-number {
      font-family: var(--font-heading);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .top-rank .rank-number {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card-body {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .card-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .card-score {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .company-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .company-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .job-type-badge {
      padding: 2px 8px;
      font-size: 0.625rem;
      font-weight: 700;
      border-radius: 9999px;
      border: 1px solid;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .job-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .meta-row {
      display: flex;
      gap: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .mini-scores {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mini-score {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .mini-label {
      font-size: 0.625rem;
      font-weight: 500;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .mini-value {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 700;
    }

    .mini-divider {
      width: 1px;
      height: 28px;
      background: var(--border-glass);
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 8px;
    }

    .card-actions {
      display: flex;
      gap: 8px;
    }

    @media (max-width: 640px) {
      .card-body { flex-direction: column-reverse; }
      .card-score { align-self: flex-end; }
    }
  `]
})
export class MatchCardComponent {
  @Input() match!: MatchResult;
  @Input() isSelected: boolean = false;
  @Output() compare = new EventEmitter<MatchResult>();

  getColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#06b6d4';
    if (score >= 40) return '#f59e0b';
    return '#f43f5e';
  }

  getTypeLabel(type: string): string {
    return JOB_TYPE_LABELS[type] || type;
  }

  getTypeColor(type: string): string {
    return JOB_TYPE_COLORS[type] || '#7c3aed';
  }

  onCardClick(): void {
    // Navigate handled by routerLink on button
  }

  toggleCompare(event: Event): void {
    event.stopPropagation();
    this.compare.emit(this.match);
  }
}

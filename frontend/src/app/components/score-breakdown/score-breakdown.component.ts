import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreBreakdown } from '../../models/match.model';
import { SkillPillsComponent } from '../skill-pills/skill-pills.component';

/**
 * ScoreBreakdownComponent — Detailed expandable panel showing
 * natural-language explanations for each scoring dimension.
 */
@Component({
  selector: 'tr-score-breakdown',
  standalone: true,
  imports: [CommonModule, SkillPillsComponent],
  template: `
    <div class="breakdown-container" *ngIf="breakdown">
      <!-- Skills Section -->
      <div class="breakdown-section" (click)="toggleSection('skills')">
        <div class="section-header">
          <div class="section-left">
            <div class="section-icon" style="background: rgba(124,58,237,0.15); color: #a78bfa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <div>
              <h4 class="section-title">Skill Match</h4>
              <span class="section-subtitle">{{ breakdown.matchedSkills?.length || 0 }} of {{ (breakdown.matchedSkills?.length || 0) + (breakdown.missingSkills?.length || 0) }} required</span>
            </div>
          </div>
          <div class="section-right">
            <span class="section-score" [style.color]="getScoreColor(skillScore)">{{ skillScore | number:'1.0-0' }}%</span>
            <span class="toggle-icon" [class.expanded]="openSections['skills']">▾</span>
          </div>
        </div>

        <div class="section-body" *ngIf="openSections['skills']">
          <p class="explanation">{{ breakdown.skillExplanation }}</p>
          <div class="jaccard-info">
            <span class="jaccard-label">Jaccard Similarity</span>
            <span class="jaccard-value">{{ breakdown.jaccardSimilarity | number:'1.3-3' }}</span>
          </div>
          <tr-skill-pills
            [matchedSkills]="breakdown.matchedSkills || []"
            [missingSkills]="breakdown.missingSkills || []"
            [bonusSkills]="breakdown.bonusSkills || []"
            [missingPreferredSkills]="breakdown.missingPreferredSkills || []"
          ></tr-skill-pills>
        </div>
      </div>

      <!-- GPA Section -->
      <div class="breakdown-section" (click)="toggleSection('gpa')">
        <div class="section-header">
          <div class="section-left">
            <div class="section-icon" style="background: rgba(6,182,212,0.15); color: #22d3ee">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 12 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <h4 class="section-title">GPA Fit</h4>
              <span class="section-subtitle">{{ breakdown.studentGpa | number:'1.2-2' }} / {{ breakdown.requiredGpa | number:'1.1-1' }} required</span>
            </div>
          </div>
          <div class="section-right">
            <span class="section-score" [style.color]="getScoreColor(gpaScore)">{{ gpaScore | number:'1.0-0' }}%</span>
            <span class="toggle-icon" [class.expanded]="openSections['gpa']">▾</span>
          </div>
        </div>

        <div class="section-body" *ngIf="openSections['gpa']">
          <p class="explanation">{{ breakdown.gpaExplanation }}</p>
          <div class="gpa-bar-wrapper">
            <div class="gpa-bar">
              <div class="gpa-fill" [style.width.%]="(breakdown.studentGpa / 4) * 100"
                   [style.background]="getScoreColor(gpaScore)"></div>
              <div class="gpa-marker" [style.left.%]="(breakdown.requiredGpa / 4) * 100"
                   *ngIf="breakdown.requiredGpa > 0">
                <span class="marker-label">Min: {{ breakdown.requiredGpa | number:'1.1-1' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Authorization Section -->
      <div class="breakdown-section" (click)="toggleSection('auth')">
        <div class="section-header">
          <div class="section-left">
            <div class="section-icon" style="background: rgba(16,185,129,0.15); color: #34d399">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h4 class="section-title">Work Authorization</h4>
              <span class="section-subtitle">{{ formatAuth(breakdown.studentAuth) }} → {{ formatAuth(breakdown.jobAuthRequired) }}</span>
            </div>
          </div>
          <div class="section-right">
            <span class="section-score" [style.color]="getScoreColor(authScore)">{{ authScore | number:'1.0-0' }}%</span>
            <span class="toggle-icon" [class.expanded]="openSections['auth']">▾</span>
          </div>
        </div>

        <div class="section-body" *ngIf="openSections['auth']">
          <p class="explanation">{{ breakdown.authExplanation }}</p>
          <div class="auth-info" *ngIf="breakdown.sponsorshipAvailable">
            <span class="sponsor-badge">✓ Sponsorship Available</span>
          </div>
          <div class="auth-info" *ngIf="!breakdown.sponsorshipAvailable">
            <span class="no-sponsor-badge">✕ No Sponsorship</span>
          </div>
        </div>
      </div>

      <!-- Improvement Tips -->
      <div class="breakdown-section tips-section" *ngIf="breakdown.improvementTips?.length">
        <div class="section-header" (click)="toggleSection('tips')">
          <div class="section-left">
            <div class="section-icon" style="background: rgba(234,179,8,0.15); color: #fbbf24">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div>
              <h4 class="section-title">How to Improve</h4>
              <span class="section-subtitle">{{ breakdown.improvementTips.length }} suggestion{{ breakdown.improvementTips.length > 1 ? 's' : '' }}</span>
            </div>
          </div>
          <span class="toggle-icon" [class.expanded]="openSections['tips']">▾</span>
        </div>

        <div class="section-body" *ngIf="openSections['tips']">
          <div class="tip-item" *ngFor="let tip of breakdown.improvementTips; let i = index">
            <span class="tip-number">{{ i + 1 }}</span>
            <div class="tip-content">
              <p class="tip-text">{{ tip }}</p>
              <span class="tip-impact" *ngIf="breakdown.tipImpacts?.[i]">
                {{ breakdown.tipImpacts[i] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breakdown-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .breakdown-section {
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      overflow: hidden;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .breakdown-section:hover {
      border-color: var(--border-glass-hover);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
    }

    .section-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .section-subtitle {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .section-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-score {
      font-family: var(--font-heading);
      font-size: 1.125rem;
      font-weight: 700;
    }

    .toggle-icon {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      transition: transform 200ms;
    }

    .toggle-icon.expanded {
      transform: rotate(180deg);
    }

    .section-body {
      padding: 0 16px 16px;
      animation: fadeIn 200ms ease;
    }

    .explanation {
      font-size: 0.8125rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }

    .jaccard-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(124, 58, 237, 0.05);
      border-radius: var(--radius-sm);
      margin-bottom: 12px;
    }

    .jaccard-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .jaccard-value {
      font-family: var(--font-mono, monospace);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--accent-violet-light);
    }

    .gpa-bar-wrapper { margin-top: 8px; }

    .gpa-bar {
      position: relative;
      height: 8px;
      background: rgba(255,255,255,0.05);
      border-radius: 9999px;
      overflow: visible;
    }

    .gpa-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .gpa-marker {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 12px;
      background: var(--text-tertiary);
      transform: translateX(-50%);
    }

    .marker-label {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.625rem;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .sponsor-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .no-sponsor-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      background: rgba(244, 63, 94, 0.1);
      color: #fb7185;
      border: 1px solid rgba(244, 63, 94, 0.2);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .tip-item {
      display: flex;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-glass);
    }

    .tip-item:last-child { border-bottom: none; }

    .tip-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(234,179,8,0.1);
      color: #fbbf24;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .tip-text {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .tip-impact {
      font-size: 0.6875rem;
      color: var(--accent-emerald);
      font-weight: 600;
      margin-top: 4px;
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ScoreBreakdownComponent {
  @Input() breakdown!: ScoreBreakdown;
  @Input() skillScore: number = 0;
  @Input() gpaScore: number = 0;
  @Input() authScore: number = 0;

  openSections: Record<string, boolean> = {
    skills: true,
    gpa: false,
    auth: false,
    tips: false,
  };

  toggleSection(section: string): void {
    this.openSections[section] = !this.openSections[section];
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#06b6d4';
    if (score >= 40) return '#f59e0b';
    return '#f43f5e';
  }

  formatAuth(auth: string): string {
    const labels: Record<string, string> = {
      US_CITIZEN: 'US Citizen',
      PERMANENT_RESIDENT: 'Permanent Resident',
      F1_OPT: 'F1-OPT',
      F1_CPT: 'F1-CPT',
      H1B: 'H1-B Visa',
      ANY: 'Any',
    };
    return labels[auth] || auth;
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiActionPlan, PlanWeek } from '../../services/ai-coach.service';

/**
 * ActionPlanModalComponent — Full-screen modal displaying a structured
 * AI-generated action plan with week-by-week timeline UI.
 */
@Component({
  selector: 'tr-action-plan-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()" *ngIf="isOpen" id="action-plan-modal">
      <div class="modal-container animate-scale-in" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="modal-close" (click)="onClose()" id="btn-close-plan">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Header -->
        <div class="plan-header">
          <div class="plan-badge">
            <span class="badge-sparkle">🎯</span>
            <span>AI Action Plan</span>
          </div>
          <h2 class="plan-title">{{ plan?.title }}</h2>
          <p class="plan-summary">{{ plan?.summary }}</p>
          <div class="plan-meta">
            <span class="meta-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              ~{{ plan?.estimatedTimeHours }}h total
            </span>
            <span class="meta-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              4 weeks
            </span>
            <span class="meta-tag source-tag">
              ✨ Gemini AI
            </span>
          </div>
        </div>

        <!-- Timeline -->
        <div class="plan-timeline">
          <div class="week-card" *ngFor="let week of plan?.weeks; let i = index"
               [class.animate-fade-in-up]="true"
               [style.animationDelay.ms]="i * 100">

            <!-- Week Number Circle -->
            <div class="week-marker">
              <div class="week-number">{{ week.weekNumber }}</div>
              <div class="week-line" *ngIf="i < (plan?.weeks?.length || 0) - 1"></div>
            </div>

            <!-- Week Content -->
            <div class="week-content glass-card">
              <div class="week-header">
                <h3 class="week-title">Week {{ week.weekNumber }}</h3>
                <span class="week-theme">{{ week.theme }}</span>
              </div>

              <!-- Goals -->
              <div class="week-section" *ngIf="week.goals?.length">
                <h4 class="section-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                  </svg>
                  Goals
                </h4>
                <ul class="section-list">
                  <li *ngFor="let goal of week.goals">{{ goal }}</li>
                </ul>
              </div>

              <!-- Tasks -->
              <div class="week-section" *ngIf="week.tasks?.length">
                <h4 class="section-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  Tasks
                </h4>
                <ul class="section-list tasks">
                  <li *ngFor="let task of week.tasks">
                    <span class="task-check">☐</span>
                    {{ task }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources -->
        <div class="plan-resources glass-card" *ngIf="plan?.resources?.length">
          <h3 class="resources-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
            Recommended Resources
          </h3>
          <ul class="resources-list">
            <li *ngFor="let resource of plan?.resources">
              <span class="resource-icon">📚</span>
              {{ resource }}
            </li>
          </ul>
        </div>

        <!-- Footer Actions -->
        <div class="plan-footer">
          <button class="btn btn-ghost" (click)="onClose()">Close</button>
          <button class="btn btn-primary" (click)="downloadPlan()" id="btn-download-plan">
            📥 Download Plan
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 20px;
      overflow-y: auto;
      animation: fadeIn 200ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      width: 100%;
      max-width: 720px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-xl);
      padding: 36px;
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 200ms;
    }

    .modal-close:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
    }

    /* Header */
    .plan-header {
      margin-bottom: 32px;
    }

    .plan-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      background: rgba(124, 58, 237, 0.08);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent-violet-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }

    .badge-sparkle { font-size: 0.875rem; }

    .plan-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 8px;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .plan-summary {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }

    .plan-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .meta-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: 9999px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .source-tag {
      background: rgba(124, 58, 237, 0.06);
      border-color: rgba(124, 58, 237, 0.15);
      color: var(--accent-violet-light);
    }

    /* Timeline */
    .plan-timeline {
      margin-bottom: 24px;
    }

    .week-card {
      display: flex;
      gap: 16px;
      margin-bottom: 4px;
    }

    .week-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .week-number {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px rgba(124, 58, 237, 0.25);
    }

    .week-line {
      width: 2px;
      flex: 1;
      min-height: 20px;
      background: linear-gradient(180deg, rgba(124, 58, 237, 0.3), rgba(6, 182, 212, 0.1));
    }

    .week-content {
      flex: 1;
      padding: 20px;
      margin-bottom: 12px;
    }

    .week-content:hover {
      transform: none;
    }

    .week-header {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 14px;
    }

    .week-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .week-theme {
      font-size: 0.8125rem;
      color: var(--accent-violet-light);
      font-weight: 500;
    }

    .week-section {
      margin-bottom: 12px;
    }

    .week-section:last-child {
      margin-bottom: 0;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-bottom: 8px;
    }

    .section-list {
      list-style: none;
      padding: 0;
    }

    .section-list li {
      font-size: 0.875rem;
      color: var(--text-secondary);
      padding: 4px 0;
      padding-left: 16px;
      position: relative;
    }

    .section-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--accent-emerald);
    }

    .section-list.tasks li {
      padding-left: 0;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .section-list.tasks li::before {
      display: none;
    }

    .task-check {
      color: var(--accent-violet-light);
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    /* Resources */
    .plan-resources {
      padding: 20px;
      margin-bottom: 24px;
    }

    .plan-resources:hover {
      transform: none;
    }

    .resources-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      margin-bottom: 12px;
    }

    .resources-list {
      list-style: none;
      padding: 0;
    }

    .resources-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: var(--text-secondary);
      padding: 6px 0;
    }

    .resource-icon { font-size: 0.875rem; }

    /* Footer */
    .plan-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--border-glass);
    }

    @media (max-width: 768px) {
      .modal-overlay { padding: 16px; }
      .modal-container { padding: 24px; }
      .plan-title { font-size: 1.25rem; }
      .week-marker { display: none; }
    }
  `]
})
export class ActionPlanModalComponent {
  @Input() isOpen = false;
  @Input() plan: AiActionPlan | null = null;
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  downloadPlan(): void {
    if (!this.plan) return;

    let text = `${this.plan.title}\n${'='.repeat(50)}\n\n`;
    text += `${this.plan.summary}\n`;
    text += `Estimated Time: ~${this.plan.estimatedTimeHours} hours\n\n`;

    for (const week of this.plan.weeks) {
      text += `--- WEEK ${week.weekNumber}: ${week.theme} ---\n\n`;

      if (week.goals?.length) {
        text += `Goals:\n`;
        week.goals.forEach(g => text += `  ✓ ${g}\n`);
        text += '\n';
      }

      if (week.tasks?.length) {
        text += `Tasks:\n`;
        week.tasks.forEach(t => text += `  ☐ ${t}\n`);
        text += '\n';
      }
    }

    if (this.plan.resources?.length) {
      text += `\n--- RESOURCES ---\n\n`;
      this.plan.resources.forEach(r => text += `  📚 ${r}\n`);
    }

    text += `\n\nGenerated by TrueRank AI Career Coach (Gemini)`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `action-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

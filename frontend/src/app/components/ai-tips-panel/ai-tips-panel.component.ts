import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiCoachService, AiTipsResponse } from '../../services/ai-coach.service';

/**
 * AiTipsPanelComponent — Displays AI-generated career tips
 * with a glowing Gemini-branded card and typing animation.
 */
@Component({
  selector: 'tr-ai-tips-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-panel glass-card animate-fade-in-up" id="ai-tips-panel">
      <!-- Header -->
      <div class="ai-header">
        <div class="ai-badge">
          <span class="ai-sparkle">✨</span>
          <span class="ai-title">AI Career Coach</span>
          <span class="ai-powered" *ngIf="tipsResponse?.source === 'GEMINI_AI'">
            Powered by Gemini
          </span>
        </div>
        <div class="ai-status" *ngIf="tipsResponse">
          <span class="status-dot" [class.live]="tipsResponse.source === 'GEMINI_AI'"></span>
          {{ tipsResponse.source === 'GEMINI_AI' ? 'Live AI' : 'Rule-Based' }}
        </div>
      </div>

      <!-- Loading State -->
      <div class="ai-loading" *ngIf="isLoading">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
        <p class="loading-text">AI is analyzing your match...</p>
      </div>

      <!-- Error State -->
      <div class="ai-error" *ngIf="error && !isLoading">
        <p>⚠️ {{ error }}</p>
      </div>

      <!-- Tips Content -->
      <div class="ai-content" *ngIf="!isLoading && tipsResponse && !error">
        <div class="tips-text" [innerHTML]="formattedTips"></div>
      </div>

      <!-- Action Plan CTA -->
      <div class="ai-cta" *ngIf="!isLoading && tipsResponse && !showPlanConfirm">
        <button class="btn btn-plan" (click)="showPlanConfirm = true" id="btn-generate-plan">
          <span class="plan-icon">📋</span>
          Generate Action Plan
          <span class="plan-arrow">→</span>
        </button>
      </div>

      <!-- Plan Confirmation -->
      <div class="ai-confirm" *ngIf="showPlanConfirm && !isPlanLoading">
        <p class="confirm-text">Would you like me to create a personalized action plan for this role?</p>
        <div class="confirm-actions">
          <button class="btn btn-primary btn-sm" (click)="onGeneratePlan()" id="btn-confirm-plan">
            ✨ Yes, create my plan
          </button>
          <button class="btn btn-ghost btn-sm" (click)="showPlanConfirm = false">
            Not now
          </button>
        </div>
      </div>

      <!-- Plan Loading -->
      <div class="ai-loading" *ngIf="isPlanLoading">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
        <p class="loading-text">Generating your personalized action plan...</p>
      </div>
    </div>
  `,
  styles: [`
    .ai-panel {
      padding: 24px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(124, 58, 237, 0.15);
      background: linear-gradient(145deg, rgba(124, 58, 237, 0.04), rgba(6, 182, 212, 0.02));
    }

    .ai-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed);
      background-size: 200% 100%;
      animation: shimmerBar 3s linear infinite;
    }

    @keyframes shimmerBar {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .ai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .ai-badge {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ai-sparkle {
      font-size: 1.25rem;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .ai-title {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .ai-powered {
      padding: 2px 8px;
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--accent-violet-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ai-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-tertiary);
    }

    .status-dot.live {
      background: var(--accent-emerald);
      box-shadow: 0 0 8px var(--accent-emerald);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Loading */
    .ai-loading {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-violet);
      animation: typingBounce 1.4s infinite both;
    }

    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-8px); opacity: 1; }
    }

    .loading-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-style: italic;
    }

    /* Error */
    .ai-error {
      padding: 12px 16px;
      background: rgba(244, 63, 94, 0.06);
      border: 1px solid rgba(244, 63, 94, 0.15);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      color: var(--accent-rose-light);
    }

    /* Content */
    .ai-content {
      margin-bottom: 16px;
    }

    .tips-text {
      font-size: 0.9rem;
      line-height: 1.8;
      color: var(--text-secondary);
      white-space: pre-wrap;
    }

    /* CTA */
    .ai-cta {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border-glass);
    }

    .btn-plan {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 24px;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1));
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: var(--radius-md);
      color: var(--accent-violet-light);
      font-family: var(--font-body);
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 300ms ease;
    }

    .btn-plan:hover {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.15));
      border-color: rgba(124, 58, 237, 0.35);
      box-shadow: 0 0 24px rgba(124, 58, 237, 0.15);
      transform: translateY(-1px);
    }

    .plan-icon { font-size: 1.125rem; }

    .plan-arrow {
      transition: transform 200ms ease;
    }

    .btn-plan:hover .plan-arrow {
      transform: translateX(4px);
    }

    /* Confirm */
    .ai-confirm {
      margin-top: 16px;
      padding: 16px;
      background: rgba(124, 58, 237, 0.04);
      border: 1px solid rgba(124, 58, 237, 0.12);
      border-radius: var(--radius-md);
      animation: fadeIn 300ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .confirm-text {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }

    .confirm-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class AiTipsPanelComponent implements OnInit, OnChanges {
  @Input() studentId: number = 1;
  @Input() jobId: number = 0;
  @Output() requestPlan = new EventEmitter<void>();

  tipsResponse: AiTipsResponse | null = null;
  isLoading = false;
  isPlanLoading = false;
  error = '';
  showPlanConfirm = false;
  formattedTips = '';

  constructor(private aiCoachService: AiCoachService) {}

  ngOnInit(): void {
    if (this.jobId > 0) {
      this.loadTips();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] && !changes['jobId'].firstChange && this.jobId > 0) {
      this.loadTips();
    }
  }

  private loadTips(): void {
    this.isLoading = true;
    this.error = '';
    this.tipsResponse = null;

    this.aiCoachService.getAiTips(this.studentId, this.jobId).subscribe({
      next: (response) => {
        this.tipsResponse = response;
        this.formattedTips = this.formatTips(response.tips);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Could not load AI tips. The AI service may be unavailable.';
        this.isLoading = false;
      }
    });
  }

  onGeneratePlan(): void {
    this.isPlanLoading = true;
    this.showPlanConfirm = false;
    this.requestPlan.emit();
  }

  /** Reset plan loading state (called by parent) */
  resetPlanLoading(): void {
    this.isPlanLoading = false;
  }

  /** Format tips text — convert bullet points to styled HTML */
  private formatTips(tips: string): string {
    if (!tips) return '';
    // Convert bullet points (•, -, *) to styled list items
    return tips
      .replace(/^[•\-\*]\s/gm, '<span class="tip-bullet">→</span> ')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
}

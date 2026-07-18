import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getScoreColor } from '../../models/match.model';

/**
 * ScoreRingComponent — Animated SVG circular progress indicator
 * with gradient stroke. The visual centerpiece of match cards.
 */
@Component({
  selector: 'tr-score-ring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="score-ring-wrapper" [style.width.px]="size" [style.height.px]="size">
      <svg [attr.width]="size" [attr.height]="size" [attr.viewBox]="'0 0 ' + size + ' ' + size">
        <defs>
          <linearGradient [attr.id]="'scoreGrad-' + uniqueId" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" [attr.stop-color]="gradientStart" />
            <stop offset="100%" [attr.stop-color]="gradientEnd" />
          </linearGradient>
        </defs>

        <!-- Background ring -->
        <circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          [attr.stroke-width]="strokeWidth"
        />

        <!-- Progress ring -->
        <circle
          #progressRing
          class="progress-ring"
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          [attr.stroke]="'url(#scoreGrad-' + uniqueId + ')'"
          [attr.stroke-width]="strokeWidth"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="currentOffset"
          [style.transition]="'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'"
          transform-origin="center"
          [attr.transform]="'rotate(-90 ' + center + ' ' + center + ')'"
        />
      </svg>

      <!-- Center content -->
      <div class="score-ring-center">
        <span class="score-value" [style.fontSize.px]="valueFontSize">
          {{ animatedScore }}
        </span>
        <span *ngIf="showLabel" class="score-label">{{ label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .score-ring-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .score-ring-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .score-value {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .score-label {
      font-size: 0.625rem;
      font-weight: 500;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 2px;
    }

    .progress-ring {
      filter: drop-shadow(0 0 6px currentColor);
    }
  `]
})
export class ScoreRingComponent implements OnChanges, AfterViewInit {
  @Input() score: number = 0;
  @Input() size: number = 100;
  @Input() strokeWidth: number = 6;
  @Input() label: string = 'SCORE';
  @Input() showLabel: boolean = true;

  uniqueId = Math.random().toString(36).substring(2, 8);
  animatedScore = 0;
  currentOffset = 0;
  private animationFrame: any;

  get radius(): number {
    return (this.size - this.strokeWidth) / 2;
  }

  get center(): number {
    return this.size / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get targetOffset(): number {
    return this.circumference * (1 - this.score / 100);
  }

  get valueFontSize(): number {
    return this.size * 0.22;
  }

  get gradientStart(): string {
    if (this.score >= 80) return '#10b981';
    if (this.score >= 60) return '#06b6d4';
    if (this.score >= 40) return '#f59e0b';
    return '#f43f5e';
  }

  get gradientEnd(): string {
    if (this.score >= 80) return '#06b6d4';
    if (this.score >= 60) return '#7c3aed';
    if (this.score >= 40) return '#f97316';
    return '#e11d48';
  }

  ngAfterViewInit(): void {
    // Start from empty
    this.currentOffset = this.circumference;
    setTimeout(() => this.animate(), 200);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['score'] && !changes['score'].firstChange) {
      this.animate();
    }
  }

  private animate(): void {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);

    const startScore = this.animatedScore;
    const targetScore = Math.round(this.score);
    const startTime = performance.now();
    const duration = 1200;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Spring easing
      const eased = 1 - Math.pow(1 - progress, 3);

      this.animatedScore = Math.round(startScore + (targetScore - startScore) * eased);
      this.currentOffset = this.circumference * (1 - (this.score * eased) / 100);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      }
    };

    this.animationFrame = requestAnimationFrame(step);
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ScoreDnaStripComponent — Horizontal bar showing score composition.
 * Each segment (skills/GPA/auth) has proportional width + color.
 */
@Component({
  selector: 'tr-score-dna-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dna-strip-wrapper">
      <div class="dna-strip">
        <div
          class="dna-segment skill-segment"
          [style.width.%]="skillWidth"
          [attr.data-tooltip]="'Skills: ' + skillScore.toFixed(0) + '%'"
        >
          <span class="segment-label" *ngIf="skillWidth > 15">Skills</span>
        </div>
        <div
          class="dna-segment gpa-segment"
          [style.width.%]="gpaWidth"
          [attr.data-tooltip]="'GPA: ' + gpaScore.toFixed(0) + '%'"
        >
          <span class="segment-label" *ngIf="gpaWidth > 15">GPA</span>
        </div>
        <div
          class="dna-segment auth-segment"
          [style.width.%]="authWidth"
          [attr.data-tooltip]="'Auth: ' + authScore.toFixed(0) + '%'"
        >
          <span class="segment-label" *ngIf="authWidth > 15">Auth</span>
        </div>
      </div>
      <div class="dna-legend" *ngIf="showLegend">
        <div class="legend-item">
          <span class="legend-dot" style="background: #7c3aed"></span>
          <span>Skills (40%)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #06b6d4"></span>
          <span>GPA (30%)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #10b981"></span>
          <span>Authorization (30%)</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dna-strip-wrapper {
      width: 100%;
    }

    .dna-strip {
      display: flex;
      width: 100%;
      height: 8px;
      border-radius: 9999px;
      overflow: hidden;
      background: rgba(255,255,255,0.03);
    }

    .dna-segment {
      position: relative;
      height: 100%;
      transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
    }

    .dna-segment:hover {
      filter: brightness(1.3);
    }

    .skill-segment {
      background: linear-gradient(90deg, #7c3aed, #9333ea);
    }

    .gpa-segment {
      background: linear-gradient(90deg, #06b6d4, #0891b2);
    }

    .auth-segment {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .segment-label {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.5rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 200ms;
    }

    .dna-strip:hover .segment-label {
      opacity: 1;
    }

    .dna-legend {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.6875rem;
      color: var(--text-tertiary);
    }

    .legend-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  `]
})
export class ScoreDnaStripComponent {
  @Input() skillScore: number = 0;
  @Input() gpaScore: number = 0;
  @Input() authScore: number = 0;
  @Input() showLegend: boolean = false;

  get totalWeighted(): number {
    return (this.skillScore * 0.4) + (this.gpaScore * 0.3) + (this.authScore * 0.3);
  }

  get skillWidth(): number {
    const total = this.totalWeighted;
    return total > 0 ? ((this.skillScore * 0.4) / total) * 100 : 33.3;
  }

  get gpaWidth(): number {
    const total = this.totalWeighted;
    return total > 0 ? ((this.gpaScore * 0.3) / total) * 100 : 33.3;
  }

  get authWidth(): number {
    const total = this.totalWeighted;
    return total > 0 ? ((this.authScore * 0.3) / total) * 100 : 33.4;
  }
}

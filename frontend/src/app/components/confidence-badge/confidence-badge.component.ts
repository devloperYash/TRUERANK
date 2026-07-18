import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ConfidenceBadgeComponent — Shows algorithm confidence level.
 */
@Component({
  selector: 'tr-confidence-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confidence-badge" [ngClass]="'confidence-' + level.toLowerCase()">
      <span class="confidence-dot"></span>
      <span class="confidence-text">{{ level }} Confidence</span>
    </div>
  `,
  styles: [`
    .confidence-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .confidence-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .confidence-high {
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .confidence-high .confidence-dot {
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .confidence-medium {
      background: rgba(245, 158, 11, 0.1);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
    .confidence-medium .confidence-dot {
      background: #f59e0b;
      box-shadow: 0 0 6px #f59e0b;
    }

    .confidence-low {
      background: rgba(244, 63, 94, 0.1);
      color: #fb7185;
      border: 1px solid rgba(244, 63, 94, 0.2);
    }
    .confidence-low .confidence-dot {
      background: #f43f5e;
      box-shadow: 0 0 6px #f43f5e;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class ConfidenceBadgeComponent {
  @Input() level: string = 'MEDIUM';
}

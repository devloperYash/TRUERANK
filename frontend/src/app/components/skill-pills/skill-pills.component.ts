import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SkillPillsComponent — Color-coded skill tags showing match status.
 * ✅ matched (green), ❌ missing (red), ⭐ bonus (gold)
 */
@Component({
  selector: 'tr-skill-pills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skill-pills-container">
      <!-- Matched Skills -->
      <span
        *ngFor="let skill of matchedSkills"
        class="skill-pill matched"
        [attr.data-tooltip]="'You have this skill'"
      >
        <span class="pill-icon">✓</span>
        {{ skill }}
      </span>

      <!-- Bonus Skills -->
      <span
        *ngFor="let skill of bonusSkills"
        class="skill-pill bonus"
        [attr.data-tooltip]="'Preferred skill — bonus points'"
      >
        <span class="pill-icon">★</span>
        {{ skill }}
      </span>

      <!-- Missing Skills -->
      <span
        *ngFor="let skill of missingSkills"
        class="skill-pill missing"
        [attr.data-tooltip]="'Skill gap — you don\\'t have this yet'"
      >
        <span class="pill-icon">✕</span>
        {{ skill }}
      </span>

      <!-- Missing Preferred Skills -->
      <span
        *ngFor="let skill of missingPreferredSkills"
        class="skill-pill missing-preferred"
        [attr.data-tooltip]="'Preferred skill you\\'re missing'"
      >
        <span class="pill-icon">○</span>
        {{ skill }}
      </span>
    </div>
  `,
  styles: [`
    .skill-pills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .skill-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      transition: all 200ms ease;
      cursor: default;
      position: relative;
      text-transform: capitalize;
    }

    .skill-pill:hover {
      transform: translateY(-1px);
    }

    .pill-icon {
      font-size: 0.65rem;
      line-height: 1;
    }

    /* Matched — Green */
    .skill-pill.matched {
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    .skill-pill.matched:hover {
      background: rgba(16, 185, 129, 0.2);
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.15);
    }

    /* Bonus — Gold */
    .skill-pill.bonus {
      background: rgba(234, 179, 8, 0.12);
      color: #fbbf24;
      border: 1px solid rgba(234, 179, 8, 0.25);
    }

    .skill-pill.bonus:hover {
      background: rgba(234, 179, 8, 0.2);
      box-shadow: 0 0 12px rgba(234, 179, 8, 0.15);
    }

    /* Missing — Red */
    .skill-pill.missing {
      background: rgba(244, 63, 94, 0.1);
      color: #fb7185;
      border: 1px solid rgba(244, 63, 94, 0.2);
    }

    .skill-pill.missing:hover {
      background: rgba(244, 63, 94, 0.18);
      box-shadow: 0 0 12px rgba(244, 63, 94, 0.12);
    }

    /* Missing Preferred — Muted */
    .skill-pill.missing-preferred {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-tertiary);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .skill-pill.missing-preferred:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  `]
})
export class SkillPillsComponent {
  @Input() matchedSkills: string[] = [];
  @Input() missingSkills: string[] = [];
  @Input() bonusSkills: string[] = [];
  @Input() missingPreferredSkills: string[] = [];
}

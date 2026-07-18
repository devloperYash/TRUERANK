import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student, WORK_AUTH_LABELS } from '../../models/student.model';
import { ScoreRingComponent } from '../../components/score-ring/score-ring.component';

/**
 * ProfilePage — Student profile editor with live completeness indicator.
 */
@Component({
  selector: 'tr-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreRingComponent],
  template: `
    <div class="page-content">
      <div class="container">
        <div class="profile-layout" *ngIf="student">
          <!-- Left: Profile Card -->
          <div class="profile-card glass-card animate-fade-in-up">
            <div class="profile-header">
              <div class="avatar-large">
                <img *ngIf="student.profileImageUrl" [src]="student.profileImageUrl" [alt]="student.name" />
                <span *ngIf="!student.profileImageUrl" class="avatar-fallback-lg">
                  {{ student.name?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <h2 class="profile-name">{{ student.name }}</h2>
              <p class="profile-uni">{{ student.university }}</p>
              <p class="profile-major">{{ student.major }} • Class of {{ student.graduationYear }}</p>
            </div>

            <!-- Completeness Ring -->
            <div class="completeness-section">
              <h4>Profile Completeness</h4>
              <div class="completeness-ring">
                <tr-score-ring
                  [score]="getCompleteness()"
                  [size]="120"
                  [strokeWidth]="8"
                  label="COMPLETE"
                ></tr-score-ring>
              </div>
              <p class="completeness-hint" *ngIf="getCompleteness() < 80">
                Complete your profile for higher confidence scores
              </p>
            </div>

            <!-- Current Skills -->
            <div class="current-skills">
              <h4>Your Skills</h4>
              <div class="skill-tags">
                <span class="skill-tag" *ngFor="let skill of getSkillList()">{{ skill }}</span>
              </div>
            </div>
          </div>

          <!-- Right: Edit Form -->
          <div class="edit-form glass-card animate-fade-in-up stagger-2">
            <h3 class="form-title">Edit Profile</h3>
            <p class="form-subtitle">Update your information to get more accurate matches</p>

            <div class="form-grid">
              <div class="form-group">
                <label for="prof-name">Full Name</label>
                <input id="prof-name" type="text" class="input-field" [(ngModel)]="student.name" />
              </div>

              <div class="form-group">
                <label for="prof-email">Email</label>
                <input id="prof-email" type="email" class="input-field" [(ngModel)]="student.email" />
              </div>

              <div class="form-group">
                <label for="prof-uni">University</label>
                <input id="prof-uni" type="text" class="input-field" [(ngModel)]="student.university" />
              </div>

              <div class="form-group">
                <label for="prof-major">Major</label>
                <input id="prof-major" type="text" class="input-field" [(ngModel)]="student.major" />
              </div>

              <div class="form-group">
                <label for="prof-gpa">GPA (0.0 - 4.0)</label>
                <input id="prof-gpa" type="number" class="input-field" [(ngModel)]="student.gpa"
                       min="0" max="4" step="0.01" />
              </div>

              <div class="form-group">
                <label for="prof-year">Graduation Year</label>
                <input id="prof-year" type="number" class="input-field" [(ngModel)]="student.graduationYear"
                       min="2020" max="2030" />
              </div>

              <div class="form-group full-width">
                <label for="prof-skills">Skills (comma-separated)</label>
                <textarea id="prof-skills" class="input-field textarea" [(ngModel)]="student.skills"
                          placeholder="Java, Python, Angular, Spring Boot..."></textarea>
              </div>

              <div class="form-group full-width">
                <label for="prof-strong">Strong Skills (comma-separated)</label>
                <textarea id="prof-strong" class="input-field textarea" [(ngModel)]="student.strongSkills"
                          placeholder="Your top 3-5 strongest skills..."></textarea>
              </div>

              <div class="form-group">
                <label for="prof-auth">Work Authorization</label>
                <select id="prof-auth" class="input-field" [(ngModel)]="student.workAuthorization">
                  <option *ngFor="let auth of authOptions" [value]="auth.value">{{ auth.label }}</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="prof-resume">Resume URL (Google Drive, Dropbox, etc.)</label>
                <input id="prof-resume" type="url" class="input-field" [(ngModel)]="student.resumeUrl"
                       placeholder="https://..." />
              </div>

              <div class="form-group full-width">
                <label for="prof-bio">Bio</label>
                <textarea id="prof-bio" class="input-field textarea" [(ngModel)]="student.bio"
                          placeholder="Tell employers about yourself..."
                          rows="3"></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn-secondary" (click)="resetForm()">Reset</button>
              <button class="btn btn-primary" (click)="saveProfile()" [disabled]="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </button>
            </div>

            <div class="save-success" *ngIf="showSuccess">
              ✓ Profile saved — your matches will update automatically
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div class="loading-state" *ngIf="!student">
          <div class="skeleton skeleton-title" style="width: 200px; margin: 0 auto"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 24px;
      align-items: start;
    }

    .profile-card {
      padding: 32px 24px;
      text-align: center;
      position: sticky;
      top: calc(var(--navbar-height) + 24px);
    }

    .avatar-large {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 16px;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(124,58,237,0.3);
    }

    .avatar-large img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback-lg {
      font-size: 2rem;
      font-weight: 700;
      color: white;
    }

    .profile-name {
      font-size: 1.375rem;
      margin-bottom: 4px;
    }

    .profile-uni {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 2px;
    }

    .profile-major {
      font-size: 0.8125rem;
      color: var(--text-tertiary);
    }

    .completeness-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-glass);
    }

    .completeness-section h4 {
      font-size: 0.8125rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }

    .completeness-ring {
      display: flex;
      justify-content: center;
    }

    .completeness-hint {
      font-size: 0.75rem;
      color: var(--accent-amber);
      margin-top: 8px;
    }

    .current-skills {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-glass);
    }

    .current-skills h4 {
      font-size: 0.8125rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
    }

    .skill-tag {
      padding: 3px 10px;
      background: rgba(124,58,237,0.1);
      border: 1px solid rgba(124,58,237,0.2);
      border-radius: 9999px;
      font-size: 0.6875rem;
      color: var(--accent-violet-light);
      font-weight: 500;
    }

    /* Form */
    .edit-form {
      padding: 32px;
    }

    .form-title {
      font-size: 1.375rem;
      margin-bottom: 4px;
    }

    .form-subtitle {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      margin-bottom: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .textarea {
      resize: vertical;
      min-height: 44px;
    }

    select.input-field {
      cursor: pointer;
    }

    select.input-field option {
      background: var(--bg-secondary);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-glass);
    }

    .save-success {
      margin-top: 16px;
      padding: 10px 16px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: var(--radius-md);
      color: #34d399;
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: center;
      animation: fadeIn 300ms ease;
    }

    @media (max-width: 900px) {
      .profile-layout {
        grid-template-columns: 1fr;
      }
      .profile-card { position: static; }
      .form-grid { grid-template-columns: 1fr; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  student: Student | null = null;
  originalStudent: Student | null = null;
  isSaving = false;
  showSuccess = false;

  authOptions = [
    { value: 'US_CITIZEN', label: 'US Citizen' },
    { value: 'PERMANENT_RESIDENT', label: 'Permanent Resident' },
    { value: 'F1_OPT', label: 'F1-OPT' },
    { value: 'F1_CPT', label: 'F1-CPT' },
    { value: 'H1B', label: 'H1-B Visa' },
    { value: 'OTHER', label: 'Other' },
  ];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getById(1).subscribe({
      next: (s) => {
        this.student = { ...s };
        this.originalStudent = { ...s };
      },
    });
  }

  getSkillList(): string[] {
    return this.student?.skills?.split(',').map(s => s.trim()).filter(s => s) || [];
  }

  getCompleteness(): number {
    if (!this.student) return 0;
    let filled = 0;
    const total = 9;
    if (this.student.name) filled++;
    if (this.student.email) filled++;
    if (this.student.university) filled++;
    if (this.student.major) filled++;
    if (this.student.gpa) filled++;
    if (this.student.skills) filled++;
    if (this.student.workAuthorization) filled++;
    if (this.student.resumeUrl) filled++;
    if (this.student.bio) filled++;
    return (filled / total) * 100;
  }

  resetForm(): void {
    if (this.originalStudent) {
      this.student = { ...this.originalStudent };
    }
  }

  saveProfile(): void {
    if (!this.student) return;
    this.isSaving = true;
    this.showSuccess = false;

    this.studentService.update(this.student.id, this.student).subscribe({
      next: (updated) => {
        this.student = { ...updated };
        this.originalStudent = { ...updated };
        this.isSaving = false;
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 4000);
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }
}

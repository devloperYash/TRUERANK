import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { StudentService } from '../../services/student.service';
import { MatchResult } from '../../models/match.model';
import { Student } from '../../models/student.model';
import { MatchCardComponent } from '../../components/match-card/match-card.component';
import { ParticleBgComponent } from '../../components/particle-bg/particle-bg.component';

/**
 * DashboardPage — Main landing page with hero section
 * and ranked match cards grid.
 */
@Component({
  selector: 'tr-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatchCardComponent, ParticleBgComponent],
  template: `
    <div class="dashboard-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <tr-particle-bg [particleCount]="40"></tr-particle-bg>
        <div class="hero-content container">
          <div class="hero-badge animate-fade-in-up">
            <span class="badge-dot"></span>
            Powered by Explainable AI
          </div>
          <h1 class="hero-title animate-fade-in-up stagger-2">
            Your matches,<br>
            <span class="text-gradient">transparently ranked.</span>
          </h1>
          <p class="hero-subtitle animate-fade-in-up stagger-3">
            See exactly why each job scored the way it did — skill overlap, GPA fit,
            and work authorization, broken down for you.
          </p>
          <div class="hero-stats animate-fade-in-up stagger-4" *ngIf="matches.length > 0">
            <div class="stat">
              <span class="stat-value">{{ matches.length }}</span>
              <span class="stat-label">Matches Found</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">{{ getTopMatchScore() | number:'1.0-0' }}%</span>
              <span class="stat-label">Best Match</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">{{ getExcellentCount() }}</span>
              <span class="stat-label">Excellent Fits</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Controls Section -->
      <section class="controls-section container">
        <div class="controls-bar">
          <div class="search-wrapper">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              class="search-input"
              placeholder="Search by company, role, or skill..."
              [(ngModel)]="searchQuery"
              (input)="filterMatches()"
              id="search-input"
            />
          </div>

          <div class="filter-pills">
            <button class="filter-pill" [class.active]="activeTypeFilter === 'all'"
                    (click)="setTypeFilter('all')">All Types</button>
            <button class="filter-pill" [class.active]="activeTypeFilter === 'INTERNSHIP'"
                    (click)="setTypeFilter('INTERNSHIP')">Internships</button>
            <button class="filter-pill" [class.active]="activeTypeFilter === 'FULL_TIME'"
                    (click)="setTypeFilter('FULL_TIME')">Full-Time</button>
            <button class="filter-pill" [class.active]="activeTypeFilter === 'PART_TIME'"
                    (click)="setTypeFilter('PART_TIME')">Part-Time</button>
            <button class="filter-pill" [class.active]="activeTypeFilter === 'CO_OP'"
                    (click)="setTypeFilter('CO_OP')">Co-Op</button>
          </div>

          <div class="filter-pills">
            <button class="filter-pill" [class.active]="activeModeFilter === 'all'"
                    (click)="setModeFilter('all')">All Modes</button>
            <button class="filter-pill" [class.active]="activeModeFilter === 'REMOTE'"
                    (click)="setModeFilter('REMOTE')">🏠 Remote</button>
            <button class="filter-pill" [class.active]="activeModeFilter === 'HYBRID'"
                    (click)="setModeFilter('HYBRID')">🔄 Hybrid</button>
            <button class="filter-pill" [class.active]="activeModeFilter === 'ONSITE'"
                    (click)="setModeFilter('ONSITE')">🏢 Onsite</button>
          </div>

          <div class="filter-pills">
            <button class="filter-pill" [class.active]="sponsorFilter === 'all'"
                    (click)="setSponsorFilter('all')">Any Visa</button>
            <button class="filter-pill" [class.active]="sponsorFilter === 'yes'"
                    (click)="setSponsorFilter('yes')">✓ Sponsors Visa</button>
            <button class="filter-pill" [class.active]="showOnlyExcellent"
                    (click)="toggleExcellent()">🏆 80%+ Matches</button>
          </div>

          <div class="sort-control">
            <select class="input-field sort-select" [(ngModel)]="sortBy" (change)="sortMatches()" id="sort-select">
              <option value="score">Score (High → Low)</option>
              <option value="company">Company (A → Z)</option>
              <option value="deadline">Deadline (Soonest)</option>
            </select>
          </div>
        </div>

        <!-- Compare Bar -->
        <div class="compare-bar" *ngIf="selectedForCompare.length > 0">
          <div class="compare-info">
            <span class="compare-count">{{ selectedForCompare.length }} selected</span>
            <span class="compare-hint">Select 2-3 jobs to compare</span>
          </div>
          <div class="compare-actions">
            <button class="btn btn-ghost btn-sm" (click)="clearCompare()">Clear</button>
            <button class="btn btn-primary btn-sm"
                    [disabled]="selectedForCompare.length < 2"
                    (click)="goToCompare()">
              Compare Now →
            </button>
          </div>
        </div>
      </section>

      <!-- Results Section -->
      <section class="results-section container">
        <!-- Loading State -->
        <div class="loading-grid" *ngIf="isLoading">
          <div class="skeleton-card" *ngFor="let i of [1,2,3,4,5,6]">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 60%"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!isLoading && filteredMatches.length === 0">
          <div class="empty-icon">🔍</div>
          <h3>No matches found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>

        <!-- Match Cards Grid -->
        <div class="match-grid" *ngIf="!isLoading && filteredMatches.length > 0">
          <tr-match-card
            *ngFor="let match of filteredMatches; let i = index"
            [match]="match"
            [isSelected]="isSelectedForCompare(match)"
            (compare)="toggleCompare($event)"
            class="animate-fade-in-up"
            [style.animationDelay.ms]="i * 60"
          ></tr-match-card>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding-bottom: 64px;
    }

    /* Hero */
    .hero-section {
      position: relative;
      padding: calc(var(--navbar-height) + 48px) 0 48px;
      overflow: hidden;
      border-bottom: 1px solid var(--border-glass);
    }

    .hero-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.08) 0%, transparent 60%),
                  radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.06) 0%, transparent 60%);
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: 9999px;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 8px var(--accent-emerald);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 16px;
      letter-spacing: -0.03em;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      max-width: 560px;
      margin-bottom: 32px;
    }

    .hero-stats {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border-glass);
    }

    /* Controls */
    .controls-section {
      padding: 24px 0;
    }

    .controls-bar {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 240px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 42px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.875rem;
      outline: none;
      transition: all 200ms;
    }

    .search-input:focus {
      border-color: var(--accent-violet);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }

    .search-input::placeholder {
      color: var(--text-tertiary);
    }

    .filter-pills {
      display: flex;
      gap: 6px;
    }

    .filter-pill {
      padding: 8px 16px;
      border: 1px solid var(--border-glass);
      border-radius: 9999px;
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms;
      font-family: var(--font-body);
    }

    .filter-pill:hover {
      border-color: var(--border-glass-hover);
      color: var(--text-primary);
    }

    .filter-pill.active {
      background: rgba(124,58,237,0.1);
      border-color: rgba(124,58,237,0.3);
      color: var(--accent-violet-light);
    }

    .sort-select {
      width: auto;
      min-width: 180px;
      padding: 10px 16px;
      font-size: 0.8125rem;
    }

    .sort-select option {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    /* Compare Bar */
    .compare-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      margin-top: 16px;
      background: rgba(124,58,237,0.06);
      border: 1px solid rgba(124,58,237,0.2);
      border-radius: var(--radius-md);
      animation: fadeIn 200ms ease;
    }

    .compare-info {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .compare-count {
      font-weight: 600;
      color: var(--accent-violet-light);
      font-size: 0.875rem;
    }

    .compare-hint {
      font-size: 0.8125rem;
      color: var(--text-tertiary);
    }

    .compare-actions {
      display: flex;
      gap: 8px;
    }

    /* Results */
    .results-section {
      padding-top: 8px;
    }

    .match-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .skeleton-card {
      padding: 24px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
    }

    .empty-state {
      text-align: center;
      padding: 64px 0;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    @media (max-width: 1024px) {
      .match-grid, .loading-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2rem; }
      .hero-stats { flex-wrap: wrap; }
      .controls-bar { flex-direction: column; }
      .filter-pills { flex-wrap: wrap; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  matches: MatchResult[] = [];
  filteredMatches: MatchResult[] = [];
  student: Student | null = null;
  isLoading = true;
  searchQuery = '';
  activeTypeFilter = 'all';
  activeModeFilter = 'all';
  sponsorFilter = 'all';
  showOnlyExcellent = false;
  sortBy = 'score';
  selectedForCompare: MatchResult[] = [];

  // Default student ID (Arjun Mehta — the first seeded student)
  private studentId = 1;

  constructor(
    private matchService: MatchService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;

    this.studentService.getById(this.studentId).subscribe({
      next: (student) => {
        this.student = student;
        // Load matches after student so we can stamp applied status
        this.matchService.getMatches(this.studentId).subscribe({
          next: (matches) => {
            const appliedIds = new Set(student.appliedJobIds || []);
            this.matches = matches.map(m => ({
              ...m,
              applied: appliedIds.has(m.job.id),
            }));
            this.filteredMatches = [...this.matches];
            this.sortMatches();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load matches:', err);
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Failed to load student:', err);
        // Still attempt to load matches without applied status
        this.matchService.getMatches(this.studentId).subscribe({
          next: (matches) => {
            this.matches = matches;
            this.filteredMatches = [...matches];
            this.isLoading = false;
          },
          error: (e) => {
            console.error('Failed to load matches:', e);
            this.isLoading = false;
          },
        });
      },
    });
  }

  filterMatches(): void {
    let result = [...this.matches];

    // Filter by type
    if (this.activeTypeFilter !== 'all') {
      result = result.filter(m => m.job.jobType === this.activeTypeFilter);
    }

    // Filter by mode
    if (this.activeModeFilter !== 'all') {
      // DataInitializer sets workMode in UPPERCASE, but just in case
      result = result.filter(m => m.job.workMode?.toUpperCase() === this.activeModeFilter.toUpperCase());
    }

    // Filter by excellent
    if (this.showOnlyExcellent) {
      result = result.filter(m => m.totalScore >= 80);
    }

    // Filter by sponsorship
    if (this.sponsorFilter === 'yes') {
      result = result.filter(m => m.job.sponsorshipAvailable);
    }

    // Filter by search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(m =>
        m.job.company.toLowerCase().includes(q) ||
        m.job.title.toLowerCase().includes(q) ||
        m.job.requiredSkills.toLowerCase().includes(q) ||
        m.job.location.toLowerCase().includes(q)
      );
    }

    this.filteredMatches = result;
    this.sortMatches();
  }

  setTypeFilter(filter: string): void {
    this.activeTypeFilter = filter;
    this.filterMatches();
  }

  setModeFilter(filter: string): void {
    this.activeModeFilter = filter;
    this.filterMatches();
  }

  toggleExcellent(): void {
    this.showOnlyExcellent = !this.showOnlyExcellent;
    this.filterMatches();
  }

  setSponsorFilter(filter: string): void {
    this.sponsorFilter = filter;
    this.filterMatches();
  }

  hasApplied(match: MatchResult): boolean {
    return this.student?.appliedJobIds?.includes(match.job.id) ?? false;
  }

  sortMatches(): void {
    switch (this.sortBy) {
      case 'score':
        this.filteredMatches.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'company':
        this.filteredMatches.sort((a, b) => a.job.company.localeCompare(b.job.company));
        break;
      case 'deadline':
        this.filteredMatches.sort((a, b) => {
          if (!a.job.deadline) return 1;
          if (!b.job.deadline) return -1;
          return new Date(a.job.deadline).getTime() - new Date(b.job.deadline).getTime();
        });
        break;
    }
  }

  toggleCompare(match: MatchResult): void {
    const idx = this.selectedForCompare.findIndex(m => m.job.id === match.job.id);
    if (idx >= 0) {
      this.selectedForCompare.splice(idx, 1);
    } else if (this.selectedForCompare.length < 3) {
      this.selectedForCompare.push(match);
    }
  }

  isSelectedForCompare(match: MatchResult): boolean {
    return this.selectedForCompare.some(m => m.job.id === match.job.id);
  }

  clearCompare(): void {
    this.selectedForCompare = [];
  }

  goToCompare(): void {
    const ids = this.selectedForCompare.map(m => m.job.id).join(',');
    this.router.navigate(['/compare'], { queryParams: { jobs: ids } });
  }

  getTopMatchScore(): number {
    return this.matches.length > 0 ? this.matches[0].totalScore : 0;
  }

  getExcellentCount(): number {
    return this.matches.filter(m => m.totalScore >= 80).length;
  }
}

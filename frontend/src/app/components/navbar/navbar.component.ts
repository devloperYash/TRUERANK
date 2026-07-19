import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, Theme } from '../../services/theme.service';

/**
 * NavbarComponent — Fixed glassmorphism navigation with logo, links,
 * theme toggle, and profile.
 */
@Component({
  selector: 'tr-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" id="main-navbar">
      <div class="nav-inner container">
        <!-- Logo -->
        <a routerLink="/dashboard" class="nav-logo" id="nav-logo">
          <div class="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#logoGrad)" />
              <path d="M8 14L12 18L20 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26">
                  <stop offset="0%" stop-color="#7c3aed"/>
                  <stop offset="100%" stop-color="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">TrueRank</span>
        </a>

        <!-- Navigation Links -->
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" id="nav-dashboard"
             class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="9" rx="1"/>
              <rect x="14" y="3" width="7" height="5" rx="1"/>
              <rect x="14" y="12" width="7" height="9" rx="1"/>
              <rect x="3" y="16" width="7" height="5" rx="1"/>
            </svg>
            Dashboard
          </a>
          <a routerLink="/profile" routerLinkActive="active" id="nav-profile"
             class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
            </svg>
            Profile
          </a>
          <a routerLink="/compare" routerLinkActive="active" id="nav-compare"
             class="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Compare
          </a>
        </div>

        <div class="nav-right">
          <!-- Theme Toggle -->
          <button class="theme-toggle" (click)="toggleTheme()" id="theme-toggle"
                  [attr.aria-label]="currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
            <div class="toggle-track">
              <!-- Sun Icon -->
              <svg class="toggle-icon sun-icon" [class.active]="currentTheme === 'light'"
                   width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <!-- Moon Icon -->
              <svg class="toggle-icon moon-icon" [class.active]="currentTheme === 'dark'"
                   width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </div>
          </button>

          <!-- Profile Avatar -->
          <div class="nav-profile" id="nav-user">
            <div class="nav-avatar">
              <img
                *ngIf="avatarUrl"
                [src]="avatarUrl"
                [alt]="userName"
                class="avatar-img"
              />
              <span *ngIf="!avatarUrl" class="avatar-fallback">
                {{ userName?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </div>
            <span class="nav-username">{{ userName || 'Student' }}</span>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--navbar-height);
      background: rgba(6, 6, 11, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-glass);
      z-index: 1000;
      transition: all 300ms ease;
    }

    :host-context([data-theme="light"]) .navbar {
      background: rgba(255, 255, 255, 0.85);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--text-primary);
      transition: opacity 200ms;
    }

    .nav-logo:hover { opacity: 0.85; }

    .logo-icon {
      display: flex;
      align-items: center;
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: all 200ms ease;
    }

    .nav-link:hover {
      color: var(--text-primary);
      background: var(--bg-surface);
    }

    .nav-link.active {
      color: var(--accent-violet-light);
      background: rgba(124, 58, 237, 0.1);
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Theme Toggle */
    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 300ms ease;
      position: relative;
      overflow: hidden;
    }

    .theme-toggle:hover {
      border-color: var(--border-glass-hover);
      background: var(--bg-surface-hover);
      transform: rotate(15deg);
    }

    .toggle-track {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 18px;
      height: 18px;
    }

    .toggle-icon {
      position: absolute;
      transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
      opacity: 0;
      transform: scale(0.5) rotate(-90deg);
      color: var(--text-secondary);
    }

    .toggle-icon.active {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    .sun-icon.active {
      color: #f59e0b;
    }

    .moon-icon.active {
      color: #a78bfa;
    }

    /* Profile */
    .nav-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      cursor: pointer;
      transition: all 200ms;
    }

    .nav-profile:hover {
      border-color: var(--border-glass-hover);
      background: var(--bg-surface-hover);
    }

    .nav-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      font-size: 0.875rem;
      font-weight: 700;
      color: white;
    }

    .nav-username {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .nav-username { display: none; }
    }
  `]
})
export class NavbarComponent {
  @Input() userName: string = '';
  @Input() avatarUrl: string = '';
  currentTheme: Theme;

  constructor(private themeService: ThemeService) {
    this.currentTheme = this.themeService.currentTheme;
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

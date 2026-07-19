import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

/**
 * ThemeService — Manages light/dark theme switching.
 *
 * - Persists preference in localStorage
 * - Auto-detects system preference on first visit
 * - Sets data-theme attribute on <html> for CSS variable switching
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'truerank-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());

  /** Observable of the current theme */
  currentTheme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  /** Get the current theme */
  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  /** Toggle between light and dark themes */
  toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /** Set a specific theme */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  /** Apply theme to the DOM */
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /** Save theme preference to localStorage */
  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      // localStorage may be unavailable in some contexts
    }
  }

  /** Get initial theme: localStorage > system preference > dark */
  private getInitialTheme(): Theme {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Theme;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }

    return 'dark';
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentService } from './services/student.service';
import { ThemeService } from './services/theme.service';
import { Student } from './models/student.model';

/**
 * Root AppComponent — Shell with navbar and router outlet.
 * Initializes theme service on startup.
 */
@Component({
  selector: 'tr-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <tr-navbar
      [userName]="student?.name || 'Student'"
      [avatarUrl]="student?.profileImageUrl || ''"
    ></tr-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      position: relative;
      z-index: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  student: Student | null = null;

  constructor(
    private studentService: StudentService,
    private themeService: ThemeService  // Initializes theme on construction
  ) {}

  ngOnInit(): void {
    this.studentService.getById(1).subscribe({
      next: (s) => { this.student = s; },
      error: () => {},
    });
  }
}

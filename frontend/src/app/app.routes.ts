import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { CompareComponent } from './pages/compare/compare.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'job/:id', component: JobDetailComponent },
  { path: 'compare', component: CompareComponent },
  { path: '**', redirectTo: 'dashboard' },
];

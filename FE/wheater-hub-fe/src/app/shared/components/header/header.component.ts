import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="nav">
        <a routerLink="/" class="logo">🌤️ WeatherHub</a>
        
        <div class="nav-buttons" *ngIf="!authService.isAuthenticated">
          <a routerLink="/auth/login" class="btn btn-secondary">Login</a>
          <a routerLink="/auth/register" class="btn btn-primary">Sign Up</a>
        </div>
        
        <div class="user-info" *ngIf="authService.isAuthenticated">
          <span class="welcome-text">Welcome, {{ (authService.currentUser$ | async)?.name }}!</span>
          <a routerLink="/favorites" class="btn btn-secondary">My Favorites</a>
          <button class="btn btn-secondary" (click)="logout()">Logout</button>
        </div>
      </nav>
    </header>
  `,
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Welcome Back</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            <div class="error-text" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Valid email is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            <div class="error-text" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary full-width" [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <p class="auth-link">
          Don't have an account? <a routerLink="/auth/register">Sign up here</a>
        </p>
        
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../core/services/weather.service';
import { AuthService } from '../../core/services/auth.service';
import { WeatherData } from '../../core/models/weather.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: "./weather-detail.component.html",
  styleUrls: ["./weather-detail.component.scss"]
})
export class WeatherDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  private destroy$ = new Subject<void>();

  authService = inject(AuthService);
  weatherData: WeatherData | null = null;
  loading = true;
  error: string | null = null;
  isFavorite = false;
  favoriteId: number | null = null; // Store favorite ID for removal
  city = '';

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.city = params['city'];
      this.loadWeatherData();
      if (this.authService.isAuthenticated) {
        this.checkIfFavorite();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWeatherData(): void {
    if (!this.city) {
      this.error = 'City name is required';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    // Using the correct method name that matches your backend
    this.weatherService.getWeatherByCity(this.city).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading weather data:', error);
        this.error = `Failed to load weather data for ${this.city}. Please check the city name and try again.`;
        this.loading = false;
      }
    });
  }

  checkIfFavorite(): void {
    if (!this.authService.isAuthenticated) {
      return;
    }

    this.weatherService.checkIfFavorite(this.city).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        // Assuming your backend returns { isFavorite: boolean, id?: number }
        this.isFavorite = result.isFavorite || false;
        this.favoriteId = result.id || null;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
        // Don't show error to user for favorite check
      }
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isAuthenticated) {
      this.showLoginPrompt();
      return;
    }

    if (this.isFavorite && this.favoriteId) {
      // Remove from favorites
      this.weatherService.removeFavorite(this.favoriteId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.isFavorite = false;
          this.favoriteId = null;
          console.log(`${this.city} removed from favorites`);
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
          // Optionally show error message to user
        }
      });
    } else {
      // Add to favorites
      this.weatherService.addFavorite({ city: this.city }).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result) => {
          this.isFavorite = true;
          this.favoriteId = result.id; // Store the ID for future removal
          console.log(`${this.city} added to favorites`);
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
          // Optionally show error message to user
        }
      });
    }
  }

  showLoginPrompt(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  retryLoad(): void {
    this.loadWeatherData();
  }

  // Helper method to check if user is authenticated
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}

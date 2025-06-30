import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../core/services/weather.service';
import { AuthService } from '../../core/services/auth.service';
import { WeatherData } from '../../core/models/weather.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: "./weather-detail.component.html",
  styleUrls: ["./weather-detail.component.scss"]
})
export class WeatherDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  authService = inject(AuthService);

  weatherData: WeatherData | null = null;
  loading = true;
  isFavorite = false;
  city = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.city = params['city'];
      this.loadWeatherData();
      if (this.authService.isAuthenticated) {
        this.checkIfFavorite();
      }
    });
  }

  loadWeatherData(): void {
    this.loading = true;
    this.weatherService.getWeatherData(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading weather data:', error);
        this.loading = false;
      }
    });
  }

  checkIfFavorite(): void {
    this.weatherService.isFavorite(this.city).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      }
    });
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      // Remove from favorites - in a real app, you'd need the favorite ID
      // This is simplified for the demo
      this.isFavorite = false;
    } else {
      this.weatherService.addToFavorites(this.city).subscribe({
        next: () => {
          this.isFavorite = true;
        }
      });
    }
  }

  showLoginPrompt(): void {
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
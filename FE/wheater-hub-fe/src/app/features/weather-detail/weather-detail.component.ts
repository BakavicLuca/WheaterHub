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
  template: `
    <div class="container">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div class="weather-result" *ngIf="!loading && weatherData">
        <div class="result-header">
          <button class="btn btn-secondary back-btn" (click)="goBack()">← Back</button>
          <h2>{{ weatherData.city }}</h2>
          <button 
            class="btn favorite-btn"
            [class.active]="isFavorite"
            (click)="toggleFavorite()"
            *ngIf="authService.isAuthenticated">
            {{ isFavorite ? '❤️ Remove from Favorites' : '❤️ Add to Favorites' }}
          </button>
          <button 
            class="btn favorite-btn"
            (click)="showLoginPrompt()"
            *ngIf="!authService.isAuthenticated">
            ❤️ Login to Save
          </button>
        </div>
        
        <div class="current-weather">
          <div class="current-temp">{{ weatherData.temperature }}°C</div>
          <div class="current-condition">{{ weatherData.condition }}</div>
        </div>

        <div class="weather-details">
          <div class="detail-card">
            <div class="detail-title">Feels Like</div>
            <div class="detail-value">{{ weatherData.feelsLike }}°C</div>
          </div>
          <div class="detail-card">
            <div class="detail-title">Humidity</div>
            <div class="detail-value">{{ weatherData.humidity }}%</div>
          </div>
          <div class="detail-card">
            <div class="detail-title">Wind Speed</div>
            <div class="detail-value">{{ weatherData.windSpeed }} km/h</div>
          </div>
          <div class="detail-card">
            <div class="detail-title">Pressure</div>
            <div class="detail-value">{{ weatherData.pressure }} hPa</div>
          </div>
          <div class="detail-card">
            <div class="detail-title">Visibility</div>
            <div class="detail-value">{{ weatherData.visibility }} km</div>
          </div>
          <div class="detail-card">
            <div class="detail-title">UV Index</div>
            <div class="detail-value">{{ weatherData.uvIndex }}</div>
          </div>
        </div>

        <div class="api-sources">
          <h3>Data aggregated from multiple sources:</h3>
          <div class="source-list">
            <span class="source-tag" *ngFor="let source of weatherData.sources">{{ source }}</span>
          </div>
        </div>
      </div>
      
      <div class="error-message" *ngIf="!loading && !weatherData">
        <h2>Weather data not found</h2>
        <p>Unable to fetch weather information for the requested location.</p>
        <button class="btn btn-primary" (click)="goBack()">Go Back</button>
      </div>
    </div>
  `,
  styleUrls: ['./weather-detail.component.scss']
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
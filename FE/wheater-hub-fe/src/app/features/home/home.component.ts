import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherData } from '../../core/models/weather.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="main-content">
        <h1 class="hero-title">Discover Weather Everywhere</h1>
        <p class="hero-subtitle">Get accurate weather data from multiple sources, all in one place</p>
        
        <div class="search-section">
          <div class="search-container">
            <input 
              type="text" 
              class="search-input" 
              [(ngModel)]="searchQuery"
              (keyup.enter)="searchWeather()"
              placeholder="Search for any city or location...">
            <button class="search-btn" (click)="searchWeather()">🔍</button>
          </div>
        </div>

        <div class="famous-cities">
          <h2 class="section-title">Popular Destinations</h2>
          <app-loading-spinner *ngIf="loading"></app-loading-spinner>
          
          <div class="cities-grid" *ngIf="!loading">
            <div 
              class="city-card" 
              *ngFor="let city of famousCities"
              (click)="viewWeatherDetails(city.city)">
              <div class="city-name">{{ city.city }}</div>
              <div class="city-temp">{{ city.temperature }}°C</div>
              <div class="city-condition">{{ city.condition }}</div>
              <div class="city-details">
                <span>Humidity: {{ city.humidity }}%</span>
                <span>Wind: {{ city.windSpeed }} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private router = inject(Router);

  searchQuery = '';
  famousCities: WeatherData[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadFamousCities();
  }

  loadFamousCities(): void {
    this.weatherService.getFamousCitiesWeather().subscribe({
      next: (cities) => {
        this.famousCities = cities;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading famous cities:', error);
        this.loading = false;
      }
    });
  }

  searchWeather(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/weather', this.searchQuery.trim()]);
    }
  }

  viewWeatherDetails(city: string): void {
    this.router.navigate(['/weather', city]);
  }
}

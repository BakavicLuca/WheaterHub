import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherData } from '../../core/models/weather.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private router = inject(Router);

  searchQuery = '';
  famousCities: WeatherData[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadFamousCities();
  }

  loadFamousCities(): void {
    this.loading = true;
    this.error = null;

    this.weatherService.getFamousCitiesWeather().subscribe({
      next: (cities) => {
        this.famousCities = cities;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading famous cities:', error);
        this.error = 'Failed to load weather data. Please try again later.';
        this.loading = false;
      }
    });
  }

  searchWeather(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/weather', query]);
    }
  }

  viewWeatherDetails(city: string): void {
    this.router.navigate(['/weather', city]);
  }

  retryLoadCities(): void {
    this.loadFamousCities();
  }

  // Track by function for better performance
  trackByCity(index: number, city: WeatherData): string {
    return city.city;
  }
}

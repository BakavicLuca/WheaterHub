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
  template: "./home.component.html",
  styleUrls: ["./home.component.scss"]
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

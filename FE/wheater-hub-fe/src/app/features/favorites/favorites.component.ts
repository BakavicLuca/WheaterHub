import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherService } from '../../core/services/weather.service';
import { FavoriteLocation } from '../../core/models/weather.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="favorites-section">
        <div class="result-header">
          <button class="btn btn-secondary back-btn" (click)="goBack()">← Back</button>
          <h2>My Favorite Locations</h2>
          <div></div>
        </div>

        <app-loading-spinner *ngIf="loading"></app-loading-spinner>

        <div class="favorites-grid" *ngIf="!loading">
          <div class="empty-state" *ngIf="favorites.length === 0">
            <p>No favorite locations yet.</p>
            <p>Start by searching for a city and adding it to favorites!</p>
            <button class="btn btn-primary" (click)="goBack()">Explore Weather</button>
          </div>

          <div
            class="favorite-card"
            *ngFor="let favorite of favorites"
            (click)="viewWeatherDetails(favorite.city)">
            <button
              class="remove-favorite"
              (click)="removeFavorite(favorite, $event)">×</button>
            <div class="city-name">{{ favorite.city }}</div>
            <div class="city-temp" *ngIf="favorite.weatherData">
              {{ favorite.weatherData.temperature }}°C
            </div>
            <div class="city-condition" *ngIf="favorite.weatherData">
              {{ favorite.weatherData.condition }}
            </div>
            <div class="added-date">
              Added: {{ favorite.addedAt | date:'short' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./favorites.component.scss"]
})
export class FavoritesComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private router = inject(Router);

  favorites: FavoriteLocation[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.weatherService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.loading = false;
      }
    });
  }

  removeFavorite(favorite: FavoriteLocation, event: Event): void {
    event.stopPropagation();

    this.weatherService.removeFavorite(favorite.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== favorite.id);
      },
      error: (error) => {
        console.error('Error removing favorite:', error);
      }
    });
  }

  viewWeatherDetails(city: string): void {
    this.router.navigate(['/weather', city]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

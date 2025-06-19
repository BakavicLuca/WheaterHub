import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData, FavoriteLocation, WeatherSearchResult } from '../models/weather.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  searchCities(query: string): Observable<WeatherSearchResult> {
    const params = new HttpParams().set('q', query);
    return this.http.get<WeatherSearchResult>(`${environment.apiUrl}/weather/search`, { params });
  }

  getWeatherData(city: string): Observable<WeatherData> {
    const params = new HttpParams().set('city', city);
    return this.http.get<WeatherData>(`${environment.apiUrl}/weather`, { params });
  }

  getFamousCitiesWeather(): Observable<WeatherData[]> {
    return this.http.get<WeatherData[]>(`${environment.apiUrl}/weather/famous-cities`);
  }

  getFavorites(): Observable<FavoriteLocation[]> {
    return this.http.get<FavoriteLocation[]>(`${environment.apiUrl}/weather/favorites`);
  }

  addToFavorites(city: string): Observable<FavoriteLocation> {
    return this.http.post<FavoriteLocation>(`${environment.apiUrl}/weather/favorites`, { city });
  }

  removeFromFavorites(favoriteId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/weather/favorites/${favoriteId}`);
  }

  isFavorite(city: string): Observable<boolean> {
    const params = new HttpParams().set('city', city);
    return this.http.get<boolean>(`${environment.apiUrl}/weather/favorites/check`, { params });
  }
}

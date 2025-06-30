// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherData } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:3000/weather';

  constructor(private http: HttpClient) {}

  getFamousCitiesWeather(): Observable<WeatherData[]> {
    console.log('Calling famous cities endpoint:', `${this.apiUrl}/famous-cities`);

    return this.http.get<WeatherData[]>(`${this.apiUrl}/famous-cities`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getWeatherByCity(city: string): Observable<WeatherData> {
    console.log('Calling city weather endpoint:', `${this.apiUrl}?city=${city}`);

    return this.http.get<WeatherData>(`${this.apiUrl}?city=${city}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  searchCities(query: string): Observable<any[]> {
    console.log('Calling search endpoint:', `${this.apiUrl}/search?q=${query}`);

    return this.http.get<any[]>(`${this.apiUrl}/search?q=${query}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Favorites methods to match your NestJS backend
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favorites`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addFavorite(favoriteData: { city: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/favorites`, favoriteData).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  removeFavorite(favoriteId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favorites/${favoriteId}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  checkIfFavorite(city: string): Observable<{ isFavorite: boolean; id?: number }> {
    return this.http.get<{ isFavorite: boolean; id?: number }>(`${this.apiUrl}/favorites/check?city=${city}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);

    if (error.status === 404) {
      console.error('Endpoint not found. Check if backend server is running on port 3000');
    } else if (error.status === 0) {
      console.error('Cannot connect to backend. Is the server running?');
    }

    return throwError(() => error);
  }

  // Fallback method with mock data if backend is not available
  getFamousCitiesWeatherFallback(): Observable<WeatherData[]> {
    const mockCities: WeatherData[] = [
      {
        city: 'London',
        temperature: 15,
        condition: 'Cloudy',
        humidity: 78,
        windSpeed: 12,
        pressure: 1013,
        visibility: 10,
        uvIndex: 3,
        feelsLike: 16,
      },
      {
        city: 'New York',
        temperature: 22,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 8,
        pressure: 1018,
        visibility: 15,
        uvIndex: 7,
        feelsLike: 24,
      },
      {
        city: 'Tokyo',
        temperature: 18,
        condition: 'Partly Cloudy',
        humidity: 72,
        windSpeed: 15,
        pressure: 1010,
        visibility: 12,
        uvIndex: 5,
        feelsLike: 19,
      }
    ];

    console.log('Using fallback mock data');
    return of(mockCities);
  }
}

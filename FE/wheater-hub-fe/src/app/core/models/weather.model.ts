export interface WeatherData {
  id?: number;
  city: string;
  country?: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  sources: string[];
  timestamp: Date;
}

export interface FavoriteLocation {
  id: number;
  userId: number;
  city: string;
  addedAt: Date;
  weatherData?: WeatherData;
}

export interface WeatherSearchResult {
  city: string;
  suggestions: string[];
}
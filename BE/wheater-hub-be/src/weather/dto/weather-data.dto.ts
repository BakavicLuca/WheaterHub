export interface WeatherData {
  city: string;
  tempC: number;          // averaged
  tempF: number;
  description: string;
  icon: string;           // pick the most common
}

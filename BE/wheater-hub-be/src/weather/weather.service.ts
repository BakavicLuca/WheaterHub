import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from '../users/user.entity';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { WeatherData } from './dto/weather-data.dto';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class WeatherService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(Favorite) private favRepo: Repository<Favorite>,
  ) {}

  /* ---------- WEATHER AGGREGATION ---------- */
  async getWeather(city: string): Promise<WeatherData> {
    const [owm, wa, ms] = await Promise.all([
      this.fetchOpenMeteoApi(city),
      this.fetchOpenWheaterApi(city),
      this.fetchMeteoBlueApi(city),
    ]);

    const avgC =
      (owm.tempC + wa.tempC + ms.tempC) / 3;

    return {
      city,
      tempC: +avgC.toFixed(1),
      tempF: +(avgC * 9/5 + 32).toFixed(1),
      description: this.mostCommon([owm.description, wa.description, ms.description]),
      icon: owm.icon || wa.icon || ms.icon,
    };
  }

  private mostCommon(arr: string[]): string {
    const freqMap = arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    let maxCount = 0;
    let mostFrequent = '';

    for (const key in freqMap) {
        if (freqMap[key] > maxCount) {
        maxCount = freqMap[key];
        mostFrequent = key;
        }
    }

    return mostFrequent;
 }

  private fetchOpenMeteoApi(city): WeatherData{
    return {
        city: city,
        tempC: 25.3,
        tempF: 77.5,
        description: 'clear sky',
        icon: '01d',
    }
  }
  private fetchOpenWheaterApi(city): WeatherData{
    return {
        city: city,
        tempC: 18.7,
        tempF: 65.7,
        description: 'scattered clouds',
        icon: '03d',
    }
  }
  private fetchMeteoBlueApi(city): WeatherData{
    return {
        city: city,
        tempC: 20.1,
        tempF: 68.2,
        description: 'light rain',
        icon: '10d',
    }
  }

  /* ---------- SEARCH / LOOKUP ---------- */
  async searchCities(q: string) {
    // Simple free geocoding search (Nominatim)…
    const { data } = await this.http.axiosRef.get(
      `https://nominatim.openstreetmap.org/search`, { params: { q, format: 'json', limit: 10 } },
    );
    return { matches: data.map(d => d.display_name) };
  }

  /* ---------- FAVOURITES ---------- */
  getFavorites(userId: number) {
    return this.favRepo.find({ where: { user: { id: userId } } });
  }
  async addFavorite(user: User, dto: AddFavoriteDto) {
    const fav = this.favRepo.create({ city: dto.city, user });
    return this.favRepo.save(fav);
  }
  async removeFavorite(userId: number, id: number) {
    await this.favRepo.delete({ id, user: { id: userId } });
  }
  async isFavorite(userId: number, city: string) {
    return !!await this.favRepo.findOne({ where: { user: { id: userId }, city } });
  }

}
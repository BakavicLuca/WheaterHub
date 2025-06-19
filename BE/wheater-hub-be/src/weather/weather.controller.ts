import {
  Controller, Get, Query, UseGuards, Post, Body,
  Delete, Param, Req
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weather: WeatherService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.weather.searchCities(q);
  }

  @Get()
  getWeather(@Query('city') city: string) {
    return this.weather.getWeather(city);
  }

  @Get('famous-cities')
  getFamous() {
    return Promise.all(['New York', 'Tokyo', 'Rome', 'Sydney']
      .map(city => this.weather.getWeather(city)));
  }

  // ---------- FAVOURITES ----------
  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavs(@Req() req) {
    return this.weather.getFavorites(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  addFav(@Req() req, @Body() dto: AddFavoriteDto) {
    return this.weather.addFavorite({ id: req.user.userId } as any, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:id')
  removeFav(@Req() req, @Param('id') id: number) {
    return this.weather.removeFavorite(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites/check')
  isFav(@Req() req, @Query('city') city: string) {
    return this.weather.isFavorite(req.user.userId, city);
  }
}
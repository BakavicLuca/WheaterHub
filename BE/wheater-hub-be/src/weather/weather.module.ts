import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { Favorite } from './entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite])
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
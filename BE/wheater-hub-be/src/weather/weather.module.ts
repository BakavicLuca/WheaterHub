import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { Favorite } from './entities/favorite.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Favorite])
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
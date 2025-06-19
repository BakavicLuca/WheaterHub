import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    HttpModule,
    AuthModule,
    UsersModule,
    WeatherModule,
  ],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    HttpModule,
    AuthModule,
    UsersModule,
    WeatherModule,
    ConfigModule.forRoot({
      isGlobal: true, // So you can use ConfigService anywhere
    }),
  ],
})
export class AppModule {}
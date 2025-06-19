import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'weather/:city',
    loadComponent: () => import('./features/weather-detail/weather-detail.component').then(m => m.WeatherDetailComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
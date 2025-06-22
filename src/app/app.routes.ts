import { Routes } from '@angular/router';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DevComponent } from './pages/dev/dev.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'user',
    component: UserProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'dev',
    component: DevComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  },

];
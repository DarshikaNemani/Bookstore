import { Routes } from '@angular/router';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login/login.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { authGuard } from './guards/auth.guard';
import { DevComponent } from './pages/dev/dev.component';
import { BookComponent } from './pages/book/book.component';
import { OrderComponent } from './pages/order/order.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'user',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [authGuard],
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'success',
        component: OrderSuccessComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'myorders',
    component: MyOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'book/:id',
    component: BookComponent,
  },
  {
    path: 'myorders',
    component: MyOrdersComponent,
  },
  {
    path:'forgetpassword',
    component: ForgotPasswordComponent
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

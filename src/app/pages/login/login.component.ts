import { Component } from '@angular/core';
import { LoginComponent as LoginFormComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginFormComponent],
  template: '<app-login></app-login>',
  styleUrl: './login.component.css'
})
export class LoginPageComponent {
}
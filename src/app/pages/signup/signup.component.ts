import { Component } from '@angular/core';
import { LoginComponent as LoginFormComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-signup',
  imports: [LoginFormComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

}

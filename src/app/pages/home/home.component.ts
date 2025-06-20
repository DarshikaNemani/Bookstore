import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { ForgotPasswordComponent } from "../../components/forgot-password/forgot-password.component";
import { LoginComponent } from "../../components/login/login.component";
import { AddressFormComponent } from "../../components/address-form/address-form.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, NavbarComponent, BookCardComponent, ForgotPasswordComponent, LoginComponent, AddressFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

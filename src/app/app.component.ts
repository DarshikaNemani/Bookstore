import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { BookCardComponent } from "./components/book-card/book-card.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { FeedbackComponent } from "./components/feedback/feedback.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { BookHeroComponent } from "./components/book-hero/book-hero.component";
import { AddressFormComponent } from "./components/address-form/address-form.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, BookCardComponent, HomeComponent, LoginComponent, FeedbackComponent, ForgotPasswordComponent, BookHeroComponent, AddressFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bookstore';
}

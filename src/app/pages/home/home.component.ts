import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { LoginComponent } from '../../components/login/login.component';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import { BookHeroComponent } from '../../components/book-hero/book-hero.component';
import { FeedbackComponent } from '../../components/feedback/feedback.component';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    FooterComponent,
    NavbarComponent,
    BookCardComponent,
    ForgotPasswordComponent,
    LoginComponent,
    AddressFormComponent,
    BookHeroComponent,
    FeedbackComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  books: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadbooks();
  }

  loadbooks(): void {
    this.productService.loadProducts().subscribe({
      next: (response) => {
        if (response.success && response.result) {
          this.books = response.result;
          console.log('Books loaded: ', this.books);
        }
        else{
          console.error('Failed: ', response.message);
        }
      },
      error: (error)=>{
        console.error('Error loading: ', error)
      }
    });
  }
}

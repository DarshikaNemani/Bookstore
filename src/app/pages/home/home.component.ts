import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { LoginComponent } from '../../components/login/login.component';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import { BookHeroComponent } from '../../components/book-hero/book-hero.component';
import { FeedbackComponent } from '../../components/feedback/feedback.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../services/models';

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
    PaginationComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  allBooks: Book[] = [];
  displayedBooks: Book[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadbooks();
  }

  loadbooks(): void {
    this.productService.loadProducts().subscribe({
      next: (response) => {
        if (response.success && response.result) {
          this.allBooks = response.result;
          this.updateDisplayedBooks();
          console.log('Books loaded: ', this.allBooks);
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

  updateDisplayedBooks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedBooks = this.allBooks.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalItems(): number {
    return this.allBooks.length;
  }
}
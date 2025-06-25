import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../services/models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [
    FooterComponent,
    NavbarComponent,
    BookCardComponent,
    PaginationComponent,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  allBooks: Book[] = [];
  displayedBooks: Book[] = [];
  filteredBooks: Book[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  isLoading: boolean = false;
  searchTerm: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadbooks();
  }

  loadbooks(): void {
    this.isLoading = true;
    this.productService.loadProducts().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.result) {
          this.allBooks = response.result;
          this.filteredBooks = this.allBooks;
          this.updateDisplayedBooks();
          console.log('Books loaded: ', this.allBooks);
        } else {
          console.error('Failed: ', response.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading: ', error);
      }
    });
  }

  onSearchChanged(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.currentPage = 1;
    if (this.searchTerm) {
      this.filteredBooks = this.allBooks.filter(book => 
        book.bookName.toLowerCase().includes(this.searchTerm) || 
        book.author.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredBooks = this.allBooks;
    }
    this.updateDisplayedBooks();
  }

  updateDisplayedBooks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalItems(): number {
    return this.filteredBooks.length;
  }
}

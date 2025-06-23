import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FeedbackComponent } from '../feedback/feedback.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-hero',
  imports: [FeedbackComponent, CommonModule],
  templateUrl: './book-hero.component.html',
  styleUrl: './book-hero.component.css',
})
export class BookHeroComponent implements OnInit {
  book: any;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadBookDetails(productId);
    } else {
      this.errorMessage = 'No book ID provided.';
    }
  }

  loadBookDetails(productId: string): void {
    this.isLoading = true;
    this.productService.loadProducts().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.result) {
          const foundBook = response.result.find(book => book._id === productId);
          if (foundBook) {
            this.book = foundBook;
          } else {
            this.errorMessage = 'Book not found.';
          }
        } else {
          this.errorMessage = response.message || 'Failed to load book details.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading books:', error);
        this.errorMessage = 'Error loading book details. Please try again later.';
      }
    });
  }}

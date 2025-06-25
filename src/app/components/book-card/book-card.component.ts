import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  imports: [MatIconModule, CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
})
export class BookCardComponent {
  @Input() book: any;

  constructor(private router: Router) {}

  onProductClick(): void {
    if (this.book && this.book._id) {
      this.router.navigate(['/book', this.book._id]);
    }
  }
}

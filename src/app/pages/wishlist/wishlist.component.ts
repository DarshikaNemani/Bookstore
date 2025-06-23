import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { WishListService } from '../../services/wish-list.service';
import { AuthService } from '../../services/auth.service';
import { WishlistItem, WishlistResponse } from '../../services/models';

@Component({
  selector: 'app-wishlist',
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  isLoading: boolean = false;
  isRemoving: string = '';

  constructor(
    private wishlistService: WishListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadWishlistItems();
    }
  }

  loadWishlistItems(): void {
    this.isLoading = true;
    this.wishlistService.loadWishList().subscribe({
      next: (response: WishlistResponse) => {
        this.isLoading = false;
        if (response.success && response.result) {
          this.wishlistItems = response.result;
          console.log('Wishlist items loaded:', this.wishlistItems);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading wishlist:', error);
        if (error.status === 401) {
          alert('Session expired. Please login again.');
          this.authService.logout();
        }
      }
    });
  }

  removeFromWishlist(productId: string): void {
    if (!confirm('Are you sure you want to remove this item from your wishlist?')) {
      return;
    }

    this.isRemoving = productId;
    this.wishlistService.removeWishList(productId).subscribe({
      next: (response) => {
        this.isRemoving = '';
        if (response.success) {
          this.wishlistItems = this.wishlistItems.filter(
            item => item.product_id._id !== productId
          );
          console.log('Item removed from wishlist');
        }
      },
      error: (error) => {
        this.isRemoving = '';
        console.error('Error removing from wishlist:', error);
        if (error.status === 401) {
          alert('Session expired. Please login again.');
          this.authService.logout();
        } else {
          alert('Failed to remove item from wishlist. Please try again.');
        }
      }
    });
  }

  get wishlistCount(): number {
    return this.wishlistItems.length;
  }
}
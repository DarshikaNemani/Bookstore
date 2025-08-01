import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishListService } from '../../services/wish-list.service';
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
  isAddingToCart = false;
  isWishlistLoading = false;
  isInWishlist = false;
  wishlistItems: any[] = [];

  isInCart = false;
  cartQuantity = 0;
  isUpdatingQuantity = false;
  cartItems: any[] = [];
  cartItemId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishListService: WishListService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadBookDetails(productId);
      this.loadWishlist();
      this.loadCartItems();
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
          const foundBook = response.result.find(
            (book) => book._id === productId
          );
          if (foundBook) {
            this.book = foundBook;
            this.checkWishlistStatus();
            this.checkCartStatus();
          } else {
            this.errorMessage = 'Book not found.';
          }
        } else {
          this.errorMessage =
            response.message || 'Failed to load book details.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading books:', error);
        this.errorMessage =
          'Error loading book details. Please try again later.';
      },
    });
  }

  loadWishlist(): void {
    this.wishListService.loadWishList().subscribe({
      next: (response) => {
        if (response.success && response.result) {
          this.wishlistItems = response.result;
          this.checkWishlistStatus();
        }
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
      },
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        if (response.success && response.result) {
          this.cartItems = response.result;
          this.checkCartStatus();
        }
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      },
    });
  }

  checkWishlistStatus(): void {
    if (this.book && this.wishlistItems.length > 0) {
      this.isInWishlist = this.wishlistItems.some(
        (item) => item.product_id._id === this.book._id
      );
    }
  }

  checkCartStatus(): void {
    if (this.book && this.cartItems.length > 0) {
      const cartItem = this.cartItems.find(
        (item) => item.product_id._id === this.book._id
      );

      if (cartItem) {
        this.isInCart = true;
        this.cartQuantity = cartItem.quantityToBuy;
        this.cartItemId = cartItem._id;
      } else {
        this.isInCart = false;
        this.cartQuantity = 0;
        this.cartItemId = null;
      }
    } else {
      this.isInCart = false;
      this.cartQuantity = 0;
      this.cartItemId = null;
    }
  }

  addToBag(): void {
    if (!this.book || !this.book._id) {
      console.error('No book selected');
      return;
    }

    if (this.book.quantity === 0) {
      alert('This book is out of stock');
      return;
    }

    this.isAddingToCart = true;

    this.cartService.addToCart(this.book._id).subscribe({
      next: (response) => {
        this.isAddingToCart = false;

        if (response.success) {
          this.isInCart = true;
          this.cartQuantity = 1;
          this.loadCartItems();
        } else {
          console.error('Add to cart failed:', response.message);
          alert('Failed to add book to cart: ' + response.message);
        }
      },
      error: (error) => {
        this.isAddingToCart = false;
        console.error('Error adding to cart:', error);
        alert('Error adding book to cart. Please try again.');
      },
    });
  }

  increaseQuantity(): void {
    if (!this.book || !this.book._id || !this.cartItemId) {
      alert(
        'Unable to update quantity. Please refresh the page and try again.'
      );
      return;
    }

    if (this.cartQuantity >= 10) {
      alert('Maximum 10 items allowed per product.');
      return;
    }

    if (this.cartQuantity >= this.book.quantity) {
      alert('Cannot add more items. Stock limit reached.');
      return;
    }

    this.isUpdatingQuantity = true;
    const newQuantity = this.cartQuantity + 1;

    this.cartService
      .updateCartQuantity(this.cartItemId, newQuantity)
      .subscribe({
        next: (response) => {
          this.isUpdatingQuantity = false;

          if (response.success) {
            this.cartQuantity = newQuantity;
            setTimeout(() => {
              this.loadCartItems();
            }, 500);
          } else {
            console.error('Update quantity failed:', response.message);
            alert('Failed to update quantity: ' + response.message);
          }
        },
        error: (error) => {
          this.isUpdatingQuantity = false;
          console.error('Error updating quantity:', error);
          alert('Error updating quantity. Please try again.');
        },
      });
  }

  decreaseQuantity(): void {
    if (!this.book || !this.book._id || !this.cartItemId) {
      alert(
        'Unable to update quantity. Please refresh the page and try again.'
      );
      return;
    }

    if (this.cartQuantity <= 1) {
      this.removeFromCart();
      return;
    }

    this.isUpdatingQuantity = true;
    const newQuantity = this.cartQuantity - 1;

    this.cartService
      .updateCartQuantity(this.cartItemId, newQuantity)
      .subscribe({
        next: (response) => {
          this.isUpdatingQuantity = false;

          if (response.success) {
            this.cartQuantity = newQuantity;
            setTimeout(() => {
              this.loadCartItems();
            }, 500);
          } else {
            console.error('Decrease quantity failed:', response.message);
            alert('Failed to update quantity: ' + response.message);
          }
        },
        error: (error) => {
          this.isUpdatingQuantity = false;
          console.error('Error updating quantity:', error);
          alert('Error updating quantity. Please try again.');
        },
      });
  }

  removeFromCart(): void {
    if (!this.cartItemId) {
      alert('Unable to remove item. Please refresh the page and try again.');
      return;
    }

    this.isUpdatingQuantity = true;

    this.cartService.removeFromCart(this.cartItemId).subscribe({
      next: (response) => {
        this.isUpdatingQuantity = false;

        if (response.success) {
          this.isInCart = false;
          this.cartQuantity = 0;
          this.cartItemId = null;
        } else {
          console.error('Remove from cart failed:', response.message);
          alert('Failed to remove from cart: ' + response.message);
        }
      },
      error: (error) => {
        this.isUpdatingQuantity = false;
        console.error('Error removing from cart:', error);
        alert('Error removing from cart. Please try again.');
      },
    });
  }

  toggleWishlist(): void {
    if (!this.book || !this.book._id) {
      console.error('No book selected');
      return;
    }

    this.isWishlistLoading = true;

    if (this.isInWishlist) {
      this.wishListService.removeWishList(this.book._id).subscribe({
        next: (response) => {
          this.isWishlistLoading = false;
          if (response.success) {
            this.isInWishlist = false;
            this.wishlistItems = this.wishlistItems.filter(
              (item) => item.product_id._id !== this.book._id
            );
          } else {
            alert('Failed to remove from wishlist: ' + response.message);
          }
        },
        error: (error) => {
          this.isWishlistLoading = false;
          console.error('Error removing from wishlist:', error);
          alert('Error removing from wishlist. Please try again.');
        },
      });
    } else {
      this.wishListService.addWishList(this.book._id).subscribe({
        next: (response) => {
          this.isWishlistLoading = false;
          if (response.success) {
            this.isInWishlist = true;
            this.loadWishlist();
          } else {
            alert('Failed to add to wishlist: ' + response.message);
          }
        },
        error: (error) => {
          this.isWishlistLoading = false;
          console.error('Error adding to wishlist:', error);
          alert('Error adding to wishlist. Please try again.');
        },
      });
    }
  }
}
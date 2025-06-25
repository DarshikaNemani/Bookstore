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
  
  // Cart-related properties
  isInCart = false;
  cartQuantity = 0;
  isUpdatingQuantity = false;
  cartItems: any[] = [];

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
          const foundBook = response.result.find(book => book._id === productId);
          if (foundBook) {
            this.book = foundBook;
            this.checkWishlistStatus();
            this.checkCartStatus();
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
      }
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        console.log('Cart items loaded:', response); // Debug log
        if (response.success && response.result) {
          this.cartItems = response.result;
          this.checkCartStatus();
        }
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      }
    });
  }

  checkWishlistStatus(): void {
    if (this.book && this.wishlistItems.length > 0) {
      this.isInWishlist = this.wishlistItems.some(item => 
        item.product_id._id === this.book._id
      );
    }
  }

  checkCartStatus(): void {
    if (this.book && this.cartItems.length > 0) {
      const cartItem = this.cartItems.find(item => 
        item.product_id._id === this.book._id
      );
      console.log('Checking cart status:', {
        bookId: this.book._id,
        cartItems: this.cartItems,
        foundItem: cartItem
      }); // Debug log
      
      if (cartItem) {
        this.isInCart = true;
        this.cartQuantity = cartItem.quantityToBuy;
        console.log('Item found in cart:', { isInCart: this.isInCart, quantity: this.cartQuantity }); // Debug log
      } else {
        this.isInCart = false;
        this.cartQuantity = 0;
        console.log('Item not in cart'); // Debug log
      }
    } else {
      this.isInCart = false;
      this.cartQuantity = 0;
    }
  }

  addToBag(): void {
    if (!this.book || !this.book._id) {
      console.error('No book selected');
      return;
    }

    // Check if book is out of stock
    if (this.book.quantity === 0) {
      alert('This book is out of stock');
      return;
    }

    console.log('Adding to cart:', this.book._id); // Debug log
    this.isAddingToCart = true;
    
    this.cartService.addToCart(this.book._id).subscribe({
      next: (response) => {
        console.log('Add to cart response:', response); // Debug log
        this.isAddingToCart = false;
        
        if (response.success) {
          // Set local state immediately
          this.isInCart = true;
          this.cartQuantity = 1;
          console.log('Cart state updated:', { isInCart: this.isInCart, quantity: this.cartQuantity }); // Debug log
          
          // Don't reload cart items immediately to avoid state conflicts
          // The user can see the quantity selector right away
        } else {
          console.error('Add to cart failed:', response.message);
          alert('Failed to add book to cart: ' + response.message);
        }
      },
      error: (error) => {
        this.isAddingToCart = false;
        console.error('Error adding to cart:', error);
        alert('Error adding book to cart. Please try again.');
      }
    });
  }

  increaseQuantity(): void {
    if (!this.book || !this.book._id) {
      console.error('No book selected');
      return;
    }

    // Check if we can increase (don't exceed available stock)
    if (this.cartQuantity >= this.book.quantity) {
      alert('Cannot add more items. Stock limit reached.');
      return;
    }

    this.isUpdatingQuantity = true;
    const newQuantity = this.cartQuantity + 1;

    console.log('Updating quantity to:', newQuantity); // Debug log
    
    this.cartService.updateCartQuantity(this.book._id, newQuantity).subscribe({
      next: (response) => {
        console.log('Update quantity response:', response); // Debug log
        this.isUpdatingQuantity = false;
        
        if (response.success) {
          this.cartQuantity = newQuantity;
          console.log('Quantity updated to:', this.cartQuantity); // Debug log
        } else {
          console.error('Update quantity failed:', response.message);
          alert('Failed to update quantity: ' + response.message);
        }
      },
      error: (error) => {
        this.isUpdatingQuantity = false;
        console.error('Error updating quantity:', error);
        alert('Error updating quantity. Please try again.');
      }
    });
  }

  decreaseQuantity(): void {
    if (!this.book || !this.book._id) {
      console.error('No book selected');
      return;
    }

    if (this.cartQuantity <= 1) {
      // Remove from cart if quantity would become 0
      this.removeFromCart();
      return;
    }

    this.isUpdatingQuantity = true;
    const newQuantity = this.cartQuantity - 1;

    console.log('Decreasing quantity to:', newQuantity); // Debug log
    
    this.cartService.updateCartQuantity(this.book._id, newQuantity).subscribe({
      next: (response) => {
        console.log('Decrease quantity response:', response); // Debug log
        this.isUpdatingQuantity = false;
        
        if (response.success) {
          this.cartQuantity = newQuantity;
          console.log('Quantity decreased to:', this.cartQuantity); // Debug log
        } else {
          console.error('Decrease quantity failed:', response.message);
          alert('Failed to update quantity: ' + response.message);
        }
      },
      error: (error) => {
        this.isUpdatingQuantity = false;
        console.error('Error updating quantity:', error);
        alert('Error updating quantity. Please try again.');
      }
    });
  }

  removeFromCart(): void {
    if (!this.book || !this.book._id) {
      console.error('No book selected');
      return;
    }

    this.isUpdatingQuantity = true;
    
    console.log('Removing from cart:', this.book._id); // Debug log
    
    this.cartService.removeFromCart(this.book._id).subscribe({
      next: (response) => {
        console.log('Remove from cart response:', response); // Debug log
        this.isUpdatingQuantity = false;
        
        if (response.success) {
          this.isInCart = false;
          this.cartQuantity = 0;
          console.log('Item removed from cart'); // Debug log
        } else {
          console.error('Remove from cart failed:', response.message);
          alert('Failed to remove from cart: ' + response.message);
        }
      },
      error: (error) => {
        this.isUpdatingQuantity = false;
        console.error('Error removing from cart:', error);
        alert('Error removing from cart. Please try again.');
      }
    });
  }

  toggleWishlist(): void {
    if (!this.book || !this.book._id) {
      console.error('No book selected');
      return;
    }

    this.isWishlistLoading = true;

    if (this.isInWishlist) {
      // Remove from wishlist
      this.wishListService.removeWishList(this.book._id).subscribe({
        next: (response) => {
          this.isWishlistLoading = false;
          if (response.success) {
            this.isInWishlist = false;
            console.log('Removed from wishlist:', response);
            // Update local wishlist items
            this.wishlistItems = this.wishlistItems.filter(item => 
              item.product_id._id !== this.book._id
            );
          } else {
            alert('Failed to remove from wishlist: ' + response.message);
          }
        },
        error: (error) => {
          this.isWishlistLoading = false;
          console.error('Error removing from wishlist:', error);
          alert('Error removing from wishlist. Please try again.');
        }
      });
    } else {
      // Add to wishlist
      this.wishListService.addWishList(this.book._id).subscribe({
        next: (response) => {
          this.isWishlistLoading = false;
          if (response.success) {
            this.isInWishlist = true;
            console.log('Added to wishlist:', response);
            // Reload wishlist to get updated data
            this.loadWishlist();
          } else {
            alert('Failed to add to wishlist: ' + response.message);
          }
        },
        error: (error) => {
          this.isWishlistLoading = false;
          console.error('Error adding to wishlist:', error);
          alert('Error adding to wishlist. Please try again.');
        }
      });
    }
  }
}
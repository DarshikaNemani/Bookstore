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
  cartItemId: string | null = null; // Store the cart item ID for updates and deletion

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
        console.log('BookHero - Cart items loaded:', response);
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
      
      console.log('BookHero - Checking cart status:', {
        bookId: this.book._id,
        cartItems: this.cartItems,
        foundItem: cartItem
      });
      
      if (cartItem) {
        this.isInCart = true;
        this.cartQuantity = cartItem.quantityToBuy;
        this.cartItemId = cartItem._id; // Store cart item ID for API calls
        console.log('BookHero - Item found in cart:', { 
          isInCart: this.isInCart, 
          quantity: this.cartQuantity,
          cartItemId: this.cartItemId 
        });
      } else {
        this.isInCart = false;
        this.cartQuantity = 0;
        this.cartItemId = null;
        console.log('BookHero - Item not in cart');
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

    // Check if book is out of stock
    if (this.book.quantity === 0) {
      alert('This book is out of stock');
      return;
    }

    console.log('BookHero - Adding to cart:', this.book._id);
    this.isAddingToCart = true;
    
    this.cartService.addToCart(this.book._id).subscribe({
      next: (response) => {
        console.log('BookHero - Add to cart response:', response);
        this.isAddingToCart = false;
        
        if (response.success) {
          // Set local state immediately
          this.isInCart = true;
          this.cartQuantity = 1;
          // Reload cart items to get the cart item ID
          this.loadCartItems();
          console.log('BookHero - Cart state updated:', { isInCart: this.isInCart, quantity: this.cartQuantity });
        } else {
          console.error('BookHero - Add to cart failed:', response.message);
          alert('Failed to add book to cart: ' + response.message);
        }
      },
      error: (error) => {
        this.isAddingToCart = false;
        console.error('BookHero - Error adding to cart:', error);
        alert('Error adding book to cart. Please try again.');
      }
    });
  }

  increaseQuantity(): void {
    if (!this.book || !this.book._id || !this.cartItemId) {
      console.error('BookHero - Missing required data:', {
        hasBook: !!this.book,
        bookId: this.book?._id,
        cartItemId: this.cartItemId
      });
      alert('Unable to update quantity. Please refresh the page and try again.');
      return;
    }

    // Check if we can increase (max 10 items, don't exceed available stock)
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

    console.log('BookHero - Increasing quantity:', {
      cartItemId: this.cartItemId,
      bookName: this.book.bookName,
      currentQuantity: this.cartQuantity,
      newQuantity: newQuantity
    });
    
    // Use cart item ID instead of product ID
    this.cartService.updateCartQuantity(this.cartItemId, newQuantity).subscribe({
      next: (response) => {
        console.log('BookHero - Increase quantity response:', response);
        this.isUpdatingQuantity = false;
        
        if (response.success) {
          console.log('BookHero - Successfully increased quantity to:', newQuantity);
          this.cartQuantity = newQuantity;
          
          // Reload cart items to verify the update
          setTimeout(() => {
            this.loadCartItems();
          }, 500);
        } else {
          console.error('BookHero - Update quantity failed:', response.message);
          alert('Failed to update quantity: ' + response.message);
        }
      },
      error: (error) => {
        this.isUpdatingQuantity = false;
        console.error('BookHero - Error updating quantity:', error);
        alert('Error updating quantity. Please try again.');
      }
    });
  }

  decreaseQuantity(): void {
    if (!this.book || !this.book._id || !this.cartItemId) {
      console.error('BookHero - Missing required data for decrease');
      alert('Unable to update quantity. Please refresh the page and try again.');
      return;
    }

    if (this.cartQuantity <= 1) {
      // Remove from cart if quantity would become 0
      this.removeFromCart();
      return;
    }

    this.isUpdatingQuantity = true;
    const newQuantity = this.cartQuantity - 1;

    console.log('BookHero - Decreasing quantity:', {
      cartItemId: this.cartItemId,
      bookName: this.book.bookName,
      currentQuantity: this.cartQuantity,
      newQuantity: newQuantity
    });
    
    // Use cart item ID instead of product ID
    this.cartService.updateCartQuantity(this.cartItemId, newQuantity).subscribe({
      next: (response) => {
        console.log('BookHero - Decrease quantity response:', response);
        this.isUpdatingQuantity = false;
        
        if (response.success) {
          console.log('BookHero - Successfully decreased quantity to:', newQuantity);
          this.cartQuantity = newQuantity;
          
          // Reload cart items to verify the update
          setTimeout(() => {
            this.loadCartItems();
          }, 500);
        } else {
          console.error('BookHero - Decrease quantity failed:', response.message);
          alert('Failed to update quantity: ' + response.message);
        }
      },
      error: (error) => {
        this.isUpdatingQuantity = false;
        console.error('BookHero - Error updating quantity:', error);
        alert('Error updating quantity. Please try again.');
      }
    });
  }

  removeFromCart(): void {
    if (!this.cartItemId) {
      console.error('BookHero - No cart item ID available for deletion');
      alert('Unable to remove item. Please refresh the page and try again.');
      return;
    }

    this.isUpdatingQuantity = true;
    
    console.log('BookHero - Removing from cart using cart item ID:', this.cartItemId);
    
    // Use the cart item ID for deletion
    this.cartService.removeFromCart(this.cartItemId).subscribe({
      next: (response) => {
        console.log('BookHero - Remove from cart response:', response);
        this.isUpdatingQuantity = false;
        
        if (response.success) {
          this.isInCart = false;
          this.cartQuantity = 0;
          this.cartItemId = null;
          console.log('BookHero - Item removed from cart');
        } else {
          console.error('BookHero - Remove from cart failed:', response.message);
          alert('Failed to remove from cart: ' + response.message);
        }
      },
      error: (error) => {
        this.isUpdatingQuantity = false;
        console.error('BookHero - Error removing from cart:', error);
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
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatIconModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() searchChanged = new EventEmitter<string>();
  isProfileOpen = false;
  isHomePage = false;
  searchTerm = '';
  cartItemCount = 0;
  private cartUpdateSubscription?: Subscription;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
      }
    });
  }

  ngOnInit(): void {
    this.updateCartCount();
    // Subscribe to cart updates instead of using interval
    this.cartUpdateSubscription = this.cartService.cartUpdated$.subscribe(() => {
      if (this.isLoggedIn()) {
        this.updateCartCount();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
    }
  }

  updateCartCount(): void {
    if (this.isLoggedIn()) {
      this.cartService.getCartItems().subscribe({
        next: (response) => {
          if (response.success && response.result) {
            this.cartItemCount = response.result.length;
          } else {
            this.cartItemCount = 0;
          }
        },
        error: (error) => {
          console.error('Error fetching cart items:', error);
          this.cartItemCount = 0;
        }
      });
    } else {
      this.cartItemCount = 0;
    }
  }

  // ... rest of the existing methods remain the same ...
  toggleProfileDropdown() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.searchChanged.emit(this.searchTerm);
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getUserDisplayName(): string {
    const userName = this.authService.getUserName();
    return userName ? `Hello ${userName.split(' ')[0]}` : 'Hello User';
  }

  logout(): void {
    this.authService.logout();
    this.isProfileOpen = false;
    this.cartItemCount = 0;
    this.router.navigate(['/home']);
  }
}
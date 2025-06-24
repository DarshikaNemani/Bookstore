import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatIconModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Output() searchChanged = new EventEmitter<string>();
  isProfileOpen = false;
  isHomePage = false;
  searchTerm = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
      }
    });
  }

  toggleProfileDropdown() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.searchChanged.emit(this.searchTerm);
  }
}

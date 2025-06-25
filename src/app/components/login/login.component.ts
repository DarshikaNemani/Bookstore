import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Form Controls (keeping original structure)
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
  ]);
  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/),
  ]);

  // State management
  hide = signal(true);
  isLoginMode: boolean = true;
  isLoading = signal(false);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    this.isLoginMode = true;
  }

  signup() {
    this.isLoginMode = false;
  }

  // Login functionality
  onLogin() {
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      this.isLoading.set(true);

      const loginData = {
        email: this.emailFormControl.value!,
        password: this.passwordFormControl.value!,
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log('Login response:', response); // Debug log to see response structure
          
          if (response && (response.token || response.success)) {
            // If fullName is not in the response, we might need to fetch user profile
            // For now, let's use the email as a fallback name
            if (!this.authService.getUserName()) {
              // Extract first part of email as a fallback name
              const emailName = this.emailFormControl.value!.split('@')[0];
              const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
              this.authService.setUserName(capitalizedName);
            }
            
            this.showSuccess('Login successful!');
            this.router.navigate(['/home']);
          } else {
            this.showError('Login failed. Please check your credentials.');
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Login error:', error);
          this.showError('Login failed. Please try again.');
        },
      });
    } else {
      this.showError('Please enter valid email and password');
    }
  }

  // Signup functionality
  onSignup() {
    if (
      this.nameFormControl.valid &&
      this.emailFormControl.valid &&
      this.passwordFormControl.valid &&
      this.phoneFormControl.valid
    ) {
      this.isLoading.set(true);

      const signupData = {
        fullName: this.nameFormControl.value!,
        email: this.emailFormControl.value!,
        password: this.passwordFormControl.value!,
        phone: this.phoneFormControl.value!,
      };

      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log('Signup response:', response); // Debug log
          
          if (response && (response.success || response.message)) {
            this.showSuccess('Registration successful! Please login.');
            this.login(); // Switch to login mode
          } else {
            this.showError('Registration failed. Please try again.');
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Signup error:', error);
          this.showError('Registration failed. Please try again.');
        },
      });
    } else {
      this.showError('Please fill all fields correctly');
    }
  }

  private resetForms() {
    this.emailFormControl.reset();
    this.passwordFormControl.reset();
    this.nameFormControl.reset();
    this.phoneFormControl.reset();
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
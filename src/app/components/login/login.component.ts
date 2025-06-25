import { Component, ChangeDetectionStrategy, signal, inject, Input, OnInit } from '@angular/core';
import {
  FormControl,
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
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @Input() isSignupMode: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

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

  hide = signal(true);
  isLoginMode: boolean = true;
  isLoading = signal(false);

  ngOnInit(): void {
    this.isLoginMode = !this.isSignupMode;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    this.isLoginMode = true;
    this.router.navigate(['/login']);
  }
  
  signup() {
    this.isLoginMode = false;
    this.router.navigate(['/signup']);
  }

  onLogin() {
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      this.isLoading.set(true);
      
      const loginData = {
        email: this.emailFormControl.value!,
        password: this.passwordFormControl.value!
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response && (response.token || response.success)) {
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
        }
      });
    } else {
      this.showError('Please enter valid email and password');
    }
  }

  onSignup() {
    if (this.nameFormControl.valid && this.emailFormControl.valid && 
        this.passwordFormControl.valid && this.phoneFormControl.valid) {
      this.isLoading.set(true);

      const signupData = {
        fullName: this.nameFormControl.value!,
        email: this.emailFormControl.value!,
        password: this.passwordFormControl.value!,
        phone: this.phoneFormControl.value!
      };

      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response && (response.success || response.message)) {
            this.showSuccess('Registration successful! Please login.');
            this.router.navigate(['/login']);
            this.resetForms();
          } else {
            this.showError('Registration failed. Please try again.');
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Signup error:', error);
          this.showError('Registration failed. Please try again.');
        }
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
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}

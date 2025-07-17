import { Component, Output, EventEmitter } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-address-form',
  imports: [
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css',
})
export class AddressFormComponent {
  @Output() addressCompleted = new EventEmitter<void>();

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
  ]);
  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/),
  ]);

  onContinue(): void {
    if (this.nameFormControl.valid && this.phoneFormControl.valid) {
      this.addressCompleted.emit();
    } else {
      alert('Please fill all required fields correctly');
    }
  }
}

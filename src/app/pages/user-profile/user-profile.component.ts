import { Component, ChangeDetectionStrategy } from '@angular/core';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface Address {
  id: number;
  type: 'Home' | 'Work' | 'Other';
  fullAddress: string;
  city: string;
  state: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    CommonModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  // Personal Details Form Controls
  fullNameFormControl = new FormControl('Poonam Yadav', [
    Validators.required,
    Validators.maxLength(50),
  ]);
  
  emailFormControl = new FormControl('Poonam.Yadav@bridgelabz.com', [
    Validators.required,
    Validators.email,
  ]);
  
  passwordFormControl = new FormControl('************', [
    Validators.required,
    Validators.minLength(6),
  ]);
  
  mobileFormControl = new FormControl('81678954778', [
    Validators.required,
    Validators.pattern(/^\d{10}$/),
  ]);

  // Address Form Controls
  addressFormControl = new FormControl('', [Validators.required]);
  cityFormControl = new FormControl('', [Validators.required]);
  stateFormControl = new FormControl('', [Validators.required]);
  addressTypeFormControl = new FormControl('Work', [Validators.required]);

  // Component state
  isEditingPersonal = false;
  isEditingAddress = false;
  showAddressForm = false;
  editingAddressId: number | null = null;

  // Sample addresses data
  addresses: Address[] = [
    {
      id: 1,
      type: 'Work',
      fullAddress: 'BridgeLabz Solutions LLP, No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore',
      city: 'Bengaluru',
      state: 'Karnataka'
    }
  ];

  // Personal Details Methods
  togglePersonalEdit() {
    this.isEditingPersonal = !this.isEditingPersonal;
    if (!this.isEditingPersonal) {
      // Reset form values if canceling edit
      this.resetPersonalForm();
    }
  }

  savePersonalDetails() {
    if (this.fullNameFormControl.valid && 
        this.emailFormControl.valid && 
        this.mobileFormControl.valid) {
      this.isEditingPersonal = false;
      // Here you would typically save to a service
      console.log('Personal details saved');
    }
  }

  resetPersonalForm() {
    this.fullNameFormControl.setValue('Poonam Yadav');
    this.emailFormControl.setValue('Poonam.Yadav@bridgelabz.com');
    this.mobileFormControl.setValue('81678954778');
  }

  // Address Methods
  showAddNewAddress() {
    this.showAddressForm = true;
    this.editingAddressId = null;
    this.clearAddressForm();
  }

  editAddress(address: Address) {
    this.showAddressForm = true;
    this.editingAddressId = address.id;
    this.addressFormControl.setValue(address.fullAddress);
    this.cityFormControl.setValue(address.city);
    this.stateFormControl.setValue(address.state);
    this.addressTypeFormControl.setValue(address.type);
  }

  saveAddress() {
    if (this.addressFormControl.valid && 
        this.cityFormControl.valid && 
        this.stateFormControl.valid) {
      
      const addressData: Address = {
        id: this.editingAddressId || Date.now(),
        type: this.addressTypeFormControl.value as 'Home' | 'Work' | 'Other',
        fullAddress: this.addressFormControl.value!,
        city: this.cityFormControl.value!,
        state: this.stateFormControl.value!
      };

      if (this.editingAddressId) {
        // Update existing address
        const index = this.addresses.findIndex(addr => addr.id === this.editingAddressId);
        if (index !== -1) {
          this.addresses[index] = addressData;
        }
      } else {
        // Add new address
        this.addresses.push(addressData);
      }

      this.cancelAddressForm();
    }
  }

  cancelAddressForm() {
    this.showAddressForm = false;
    this.editingAddressId = null;
    this.clearAddressForm();
  }

  clearAddressForm() {
    this.addressFormControl.setValue('');
    this.cityFormControl.setValue('');
    this.stateFormControl.setValue('');
    this.addressTypeFormControl.setValue('Home');
  }

  deleteAddress(addressId: number) {
    this.addresses = this.addresses.filter(addr => addr.id !== addressId);
  }
} 
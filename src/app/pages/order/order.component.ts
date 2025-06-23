import { Component } from '@angular/core';
import { AddressFormComponent } from "../../components/address-form/address-form.component";

@Component({
  selector: 'app-order',
  imports: [AddressFormComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

}

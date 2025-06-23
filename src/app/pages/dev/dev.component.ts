import { Component } from '@angular/core';
import { BookHeroComponent } from "../../components/book-hero/book-hero.component";
import { OrderSuccessComponent } from "../../components/order-success/order-success.component";

@Component({
  selector: 'app-dev',
  imports: [BookHeroComponent, OrderSuccessComponent],
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.css'
})
export class DevComponent {

}

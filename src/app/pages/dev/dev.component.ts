import { Component } from '@angular/core';
import { BookHeroComponent } from "../../components/book-hero/book-hero.component";

@Component({
  selector: 'app-dev',
  imports: [BookHeroComponent],
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.css'
})
export class DevComponent {

}

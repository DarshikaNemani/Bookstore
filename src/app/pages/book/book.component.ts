import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { BookHeroComponent } from "../../components/book-hero/book-hero.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-book',
  imports: [NavbarComponent, BookHeroComponent, FooterComponent],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {

}

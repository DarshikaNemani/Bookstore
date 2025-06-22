import { Component } from '@angular/core';
import { FeedbackComponent } from "../feedback/feedback.component";

@Component({
  selector: 'app-book-hero',
  imports: [FeedbackComponent],
  templateUrl: './book-hero.component.html',
  styleUrl: './book-hero.component.css'
})
export class BookHeroComponent {

}

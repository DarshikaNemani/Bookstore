import { Component, Input, OnInit } from '@angular/core';
import { FeebackService } from '../../services/feeback.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-feedback',
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit{
  @Input() productId : string ='';

  bookRating: number = 0;
  reviewContent: string = '';
  isSubmit: boolean = false;
  feedbackList : any[] = [];
  isLoading: boolean = false;

  constructor(private feedbackService: FeebackService, private authService: AuthService){}

  ngOnInit(): void {
    if(this.productId && this.authService.isAuthenticated()){
      this.loadFeedbacks();
    }
  }

  selectRating(rating:number):void{
    this.bookRating = rating;
  }

  onSubmit(){
    if(!this.authService.isAuthenticated()){
      alert('Please login to submit feedback');
      return;
    }

    if( this.bookRating === 0 || !this.reviewContent.trim()){
      alert('Please provide both rating and review');
      return;
    }

    this.isSubmit = true;
    const payload = {
      comment: this.reviewContent,
      rating: this.bookRating
    }

    this.feedbackService.addFeedback(this.productId, payload).subscribe({
      next: (response) =>{
        this.isSubmit = false;
        console.log('Feedback Submitted', response);

        this.bookRating = 0;
        this.reviewContent = '';
        this.loadFeedbacks();
      },
      error: (error) => {
        this.isSubmit = false;
        console.log('Error loading feedbacks:', error);
        if(error.status === 401){
          alert('Session expired. Please login again.');
          this.authService.logout();
        } else {
          alert('Failed to submit feedback. Please try again.');
        }
      }
    })
  }

  loadFeedbacks():void{
    if(!this.authService.isAuthenticated()){
      return;
    }

    this.isLoading = true;
    this.feedbackService.loadFeedback(this.productId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if(response.success && response.result){
          this.feedbackList = response.result;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading feedbacks:', error);
      }
    });
  }

  getStarsArray(rating:number):boolean[]{
    return Array(5).fill(false).map((_,index) => index < rating);
  }
}
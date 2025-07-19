import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BookHeroComponent } from './book-hero.component';

describe('BookHeroComponent', () => {
  let component: BookHeroComponent;
  let fixture: ComponentFixture<BookHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BookHeroComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

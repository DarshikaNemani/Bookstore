import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeebackService } from './feeback.service';

describe('FeebackService', () => {
  let service: FeebackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FeebackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

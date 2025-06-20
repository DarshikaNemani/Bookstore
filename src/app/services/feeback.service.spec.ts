import { TestBed } from '@angular/core/testing';

import { FeebackService } from './feeback.service';

describe('FeebackService', () => {
  let service: FeebackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeebackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

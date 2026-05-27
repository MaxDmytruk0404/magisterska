import { TestBed } from '@angular/core/testing';

import { SendInfo } from './send-info';

describe('SendInfo', () => {
  let service: SendInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

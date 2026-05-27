import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveAnalize } from './recursive-analize';

describe('RecursiveAnalize', () => {
  let component: RecursiveAnalize;
  let fixture: ComponentFixture<RecursiveAnalize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursiveAnalize],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursiveAnalize);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

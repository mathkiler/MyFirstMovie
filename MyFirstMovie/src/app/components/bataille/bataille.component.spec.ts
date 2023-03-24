import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatailleComponent } from './bataille.component';

describe('BatailleComponent', () => {
  let component: BatailleComponent;
  let fixture: ComponentFixture<BatailleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatailleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatailleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

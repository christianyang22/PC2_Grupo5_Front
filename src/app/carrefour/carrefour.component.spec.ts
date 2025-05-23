import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrefourComponent } from './carrefour.component';

describe('CarrefourComponent', () => {
  let component: CarrefourComponent;
  let fixture: ComponentFixture<CarrefourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrefourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrefourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

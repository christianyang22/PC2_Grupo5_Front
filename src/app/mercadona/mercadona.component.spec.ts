import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MercadonaComponent } from './mercadona.component';

describe('MercadonaComponent', () => {
  let component: MercadonaComponent;
  let fixture: ComponentFixture<MercadonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MercadonaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MercadonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

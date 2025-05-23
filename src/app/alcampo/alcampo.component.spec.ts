import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlcampoComponent } from './alcampo.component';

describe('AlcampoComponent', () => {
  let component: AlcampoComponent;
  let fixture: ComponentFixture<AlcampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlcampoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlcampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritosComponent } from './favoritos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavoritosService } from './favoritos.service';
import { of } from 'rxjs';

describe('FavoritosComponent', () => {
  let component: FavoritosComponent;
  let fixture: ComponentFixture<FavoritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoritosComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: FavoritosService,
          useValue: {
            obtenerFavoritosUsuario: () => of([]),
            eliminarFavorito: () => of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favoritos on init', () => {
    expect(component.favoritos).toEqual([]);
    expect(component.cargado).toBeTrue();
  });
});
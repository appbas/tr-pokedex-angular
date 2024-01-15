import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsCardComponent } from './pokemons-card.component';

describe('PokemonsCardComponent', () => {
  let component: PokemonsCardComponent;
  let fixture: ComponentFixture<PokemonsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokemonsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PokemonsStore } from '../../store/pokemons.store';
import { PokemonsCardComponent } from '../pokemons-card/pokemons-card.component';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [CommonModule, PokemonsCardComponent],
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.scss'],
})
export class PokemonsListComponent implements OnInit, OnDestroy {
  private _pokemonsStore = inject(PokemonsStore);

  pokemonsList$ = this._pokemonsStore.selectPokemons$;

  constructor() {}

  ngOnInit(): void {
    console.log('PokemonsListComponent', 'init');
    if (!this._pokemonsStore.hasResult()) {
      this._pokemonsStore.pokemonsSearch();
    }
  }

  ngOnDestroy(): void {
    console.log('PokemonsListComponent', 'destroy');
  }
}

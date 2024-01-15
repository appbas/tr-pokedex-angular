import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonsCardComponent } from '../pokemons-card/pokemons-card.component';
import { PokemonsService } from '../../pokemons.service';
import {
  concatAll,
  concatWith,
  filter,
  map,
  merge,
  mergeAll,
  mergeMap,
  of,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { PokemonType } from '../../models/pokemon.type';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [CommonModule, PokemonsCardComponent],
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.scss'],
})
export class PokemonsListComponent {
  private _pokemonService = inject(PokemonsService);

  pokemonsList$ = this._pokemonService.list().pipe(
    mergeAll(),
    map((pokemon) =>
      this._pokemonService.getTypesById(pokemon.id as string).pipe(
        map(
          (types) =>
            ({
              ...pokemon,
              types,
            } as PokemonType)
        )
      )
    ),
    concatAll(),
    toArray()
  );

  constructor() {}
}

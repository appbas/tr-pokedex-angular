import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  map,
  switchMap,
  concatAll,
  tap,
  mergeAll,
  toArray,
  Observable,
} from 'rxjs';
import { PokemonDetailsType } from '../models/pokemon-details.type';
import { PokemonType } from '../models/pokemon.type';
import { PokemonsService } from '../pokemons.service';

export enum StateEnum {
  idle = 0,
  loading = 1,
  success = 2,
  error = 3,
  noResults = 4,
}

export interface ResultState<T> {
  state: StateEnum;
  result: T;
}

export type PokemonState = {
  pokemons: ResultState<PokemonType[] | null>;
  pokemon: PokemonType | null | undefined;
  japoneseName: ResultState<string | null>;
};

const initialState: PokemonState = {
  pokemons: {
    state: StateEnum.idle,
    result: null,
  },
  pokemon: null,
  japoneseName: {
    state: StateEnum.idle,
    result: null,
  },
};

@Injectable()
export class PokemonsStore extends ComponentStore<PokemonState> {
  private _pokemonsService = inject(PokemonsService);

  constructor() {
    super(initialState);
  }

  // selectors
  readonly selectPokemons$ = this.select(({ pokemons }) => pokemons);
  readonly selectPokemon$ = this.select(({ pokemon }) => pokemon);
  readonly selectJaponeseName$ = this.select(
    ({ japoneseName }) => japoneseName
  );

  // effects
  readonly pokemonById = this.effect((pokemonId$: Observable<string>) =>
    pokemonId$.pipe(
      tap((pokemonId) => {
        const pokemon = this.get().pokemons.result?.find(
          (item) => item.id === pokemonId
        );
        this.patchState({
          pokemon,
        });
      })
    )
  );

  readonly pokemonsSearch = this.effect(($) =>
    $.pipe(
      tap(() =>
        this.patchState({
          pokemons: {
            state: StateEnum.loading,
            result: null,
          },
        })
      ),
      switchMap(() =>
        this._pokemonsService.list().pipe(
          mergeAll(),
          map((pokemon) =>
            this._pokemonsService.getTypesById(pokemon.id as string).pipe(
              map(
                (types) =>
                  ({
                    ...pokemon,
                    types,
                  } as PokemonType)
              )
            )
          ),
          mergeAll(),
          map((pokemon) =>
            this._pokemonsService.getStatsById(pokemon.id as string).pipe(
              map((stats) => ({
                ...pokemon,
                stats,
              }))
            )
          ),
          concatAll(),
          toArray(),
          tap((results) =>
            this.patchState({
              pokemons: {
                state:
                  !!results && results.length
                    ? StateEnum.success
                    : StateEnum.noResults,
                result: results,
              },
            })
          )
        )
      )
    )
  );

  readonly japoneseNameById = this.effect((pokemonId$: Observable<string>) =>
    pokemonId$.pipe(
      tap(() =>
        this.patchState({
          japoneseName: {
            state: StateEnum.loading,
            result: null,
          },
        })
      ),
      switchMap((pokemonId) =>
        this._pokemonsService.getPokemonJapneseNameById(pokemonId).pipe(
          tap((japoneseName) =>
            this.patchState({
              japoneseName: {
                state:
                  !!japoneseName && japoneseName.length > 0
                    ? StateEnum.success
                    : StateEnum.noResults,
                result: japoneseName,
              },
            })
          )
        )
      )
    )
  );

  clearPokemonSelected(): void {
    this.patchState({
      pokemon: null,
      japoneseName: initialState.japoneseName,
    });
  }

  hasResult(): boolean {
    const pokemons = this.get().pokemons;
    return !!pokemons && !!pokemons.result && pokemons.result?.length > 0;
  }
}

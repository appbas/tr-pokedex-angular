import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { map, switchMap, concatAll, tap, mergeAll, toArray } from 'rxjs';
import { PokemonType } from '../models/pokemon.type';
import { PokemonsService } from '../pokemons.service';

export enum StateEnum {
  aguardando = 0,
  carregando = 1,
  sucesso = 2,
  error = 3,
  noResults = 4,
}

export interface ResultState<T> {
  state: StateEnum;
  result: T;
}

export type PokemonState = {
  pokemons: ResultState<PokemonType[] | null>;
  pokemonDetail: any | null;
};

const initialState: PokemonState = {
  pokemons: {
    state: StateEnum.aguardando,
    result: null,
  },
  pokemonDetail: null,
};

@Injectable()
export class PokemonsStore extends ComponentStore<PokemonState> {
  private _pokemonsService = inject(PokemonsService);

  constructor() {
    super(initialState);
  }

  // selectors
  readonly selectPokemons$ = this.select(({ pokemons }) => pokemons);

  // effects
  readonly pokemonsSearch = this.effect(($) =>
    $.pipe(
      tap(() =>
        this.patchState({
          pokemons: {
            state: StateEnum.carregando,
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
          concatAll(),
          toArray(),
          tap((results) =>
            this.patchState({
              pokemons: {
                state:
                  !!results && results.length
                    ? StateEnum.sucesso
                    : StateEnum.noResults,
                result: results,
              },
            })
          )
        )
      )
    )
  );

  hasResult(): boolean {
    const pokemons = this.get().pokemons;
    return !!pokemons && !!pokemons.result && pokemons.result?.length > 0;
  }
}

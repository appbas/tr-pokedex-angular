import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  concatAll,
  map,
  mergeAll,
  Observable,
  switchMap,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs';
import { FilterPokemonType } from '../models/filter-pokemon.type';
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
  resultFilter: T;
}

export type PokemonState = {
  filterPokemon: FilterPokemonType;
  pokemons: ResultState<PokemonType[]>;
  pokemon: PokemonType | null | undefined;
  japoneseName: ResultState<string | null>;
};

const initialState: PokemonState = {
  filterPokemon: {
    offset: -1,
    limit: 20,
  } as FilterPokemonType,
  pokemons: {
    state: StateEnum.idle,
    result: [],
    resultFilter: [],
  },
  pokemon: null,
  japoneseName: {
    state: StateEnum.idle,
    result: null,
    resultFilter: null,
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
            result: this.get().pokemons.result,
            resultFilter: this.get().pokemons.result,
          },
        })
      ),
      switchMap(() =>
        this._pokemonsService.list(this.updateAndGetFilterPokemon()).pipe(
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
          withLatestFrom(this.state$),
          tap(([results, state]) =>
            this.patchState({
              pokemons: {
                state:
                  !!results && results.length > 0
                    ? StateEnum.success
                    : StateEnum.noResults,
                result: [...state.pokemons.result, ...results],
                resultFilter: [...state.pokemons.result, ...results],
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
            resultFilter: null,
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
                resultFilter: null,
              },
            })
          )
        )
      )
    )
  );

  readonly searchPokemonByName = this.effect(
    (pokemonName$: Observable<string | null>) =>
      pokemonName$.pipe(
        tap((pokemonName) => {
          const resultFilter = this.get().pokemons.result.filter((pokemon) => {
            if (!!!pokemonName) {
              return true;
            }
            return pokemon.name
              .toLowerCase()
              .includes(pokemonName!.toLowerCase());
          });
          this.patchState({
            filterPokemon: {
              ...this.get().filterPokemon,
              pokemonName,
            },
            pokemons: {
              ...this.get().pokemons,
              resultFilter,
            },
          });
        })
      )
  );

  updateAndGetFilterPokemon(): FilterPokemonType {
    const filterOld = this.get().filterPokemon;
    const filterNew = {
      ...filterOld,
      offset: filterOld.offset === -1 ? 0 : filterOld.offset + filterOld.limit,
    };
    this.patchState({
      filterPokemon: filterNew,
    });

    return filterNew;
  }

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

  isPokemonSearchNotLoading(): boolean {
    return this.get().pokemons.state !== 1;
  }

  isPokemonSearchByName(): boolean {
    const filter = this.get().filterPokemon;
    return (
      !!filter && !!filter.pokemonName && filter.pokemonName.trim().length > 0
    );
  }
}

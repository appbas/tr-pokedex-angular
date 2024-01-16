import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import {
  mergeMap,
  mergeAll,
  switchMap,
  concatAll,
  concatMap,
  concatWith,
  tap,
  filter,
  catchError,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PokemonType } from './models/pokemon.type';
import { PokemonTypesType } from './models/pokemon-types.type';
import { PokemonDetailsType } from './models/pokemon-details.type';

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private _httpClient = inject(HttpClient);

  private readonly API = environment.pokeapi;

  list(): Observable<PokemonType[]> {
    return this._httpClient
      .get<PokemonType>(this.API + `pokemon/?offset=0&limit=2;`)
      .pipe(
        map((result: any) => result.results as []),
        map((results) =>
          results.map(
            (item: any) =>
              ({
                id: item.url.split('/')[item.url.split('/').length - 2],
                name: item.name,
                url: item.url,
              } as PokemonType)
          )
        )
      );
  }

  getTypesById(id: string): Observable<PokemonTypesType[]> {
    return this._httpClient
      .get<PokemonTypesType>(this.API + `pokemon/${id}`)
      .pipe(
        map((result: any) => result.types as any),
        map((results) =>
          results.map(
            (item: any) =>
              ({
                slot: item.slot,
                name: item.type.name,
              } as PokemonTypesType)
          )
        )
      );
  }

  getStatsById(id: string): Observable<PokemonDetailsType[]> {
    return this._httpClient
      .get<PokemonTypesType>(this.API + `pokemon/${id}`)
      .pipe(
        map((result: any) => result.stats as any),
        map((results) =>
          results.map(
            (item: any) =>
              ({
                statName: item.stat.name,
                baseStat: item.base_stat,
              } as PokemonDetailsType)
          )
        )
      );
  }

  getPokemonJapneseNameById(id: string): Observable<string> {
    return this._httpClient
      .get<string>(this.API + `pokemon-species/${id}`)
      .pipe(
        map((result: any) => result.names as any[]),
        map((names: any[]) => {
          const name = names.find((name) => name.language.name === 'ja-Hrkt');
          return name.name;
        }),
        catchError((e) => of(''))
      );
  }
}

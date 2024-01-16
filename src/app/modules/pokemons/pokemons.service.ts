import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FilterPokemonType } from './models/filter-pokemon.type';
import { PokemonDetailsType } from './models/pokemon-details.type';
import { PokemonTypesType } from './models/pokemon-types.type';
import { PokemonType } from './models/pokemon.type';

type PokemonDetailsAPIType = {
  stats: any[];
  types: [];
};

@Injectable({
  providedIn: 'root',
})
export class PokemonsService {
  private _httpClient = inject(HttpClient);

  private readonly API = environment.pokeapi;

  list(filterPokemon: FilterPokemonType): Observable<PokemonType[]> {
    return this._httpClient
      .get<PokemonType>(
        this.API +
          `pokemon/?offset=${filterPokemon.offset}&limit=${filterPokemon.limit}`
      )
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

  getPokemonDetails(id: string): Observable<PokemonDetailsAPIType> {
    return this._httpClient
      .get<PokemonTypesType>(this.API + `pokemon/${id}`)
      .pipe(
        map(
          (result: any) =>
            ({
              types: result.types as any[],
              stats: result.stats as any,
            } as PokemonDetailsAPIType)
        ),
        map((results) => {
          const types = results.types.map(
            (item: any) =>
              ({
                slot: item.slot,
                name: item.type.name,
              } as PokemonTypesType)
          );
          const stats = results.stats.map(
            (item: any) =>
              ({
                statName: item.stat.name,
                baseStat: item.base_stat,
              } as PokemonDetailsType)
          );

          return {
            types,
            stats,
          } as PokemonDetailsAPIType;
        })
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

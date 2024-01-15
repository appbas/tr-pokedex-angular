import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PokemonType } from './models/pokemon.type';

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
        // map((r) => [r.pop()]),
        map((results) =>
          results.map(
            (item: any) =>
              ({
                id: item.url.split('/')[item.url.split('/').length - 2],
                name: item.name,
                url: item.url,
              } as PokemonType)
          )
        ),
        tap(console.log)
      );
  }
}

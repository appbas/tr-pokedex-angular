import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PokemonsStore } from '../../store/pokemons.store';

@Component({
  selector: 'app-pokemons-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemons-details.component.html',
  styleUrls: ['./pokemons-details.component.scss'],
})
export class PokemonsDetailsComponent implements OnInit, OnDestroy {
  private _activatedRoute = inject(ActivatedRoute);
  private _pokemonsStore = inject(PokemonsStore);

  pokemon$ = this._pokemonsStore.selectPokemon$;
  japoneseName$ = this._pokemonsStore.selectJaponeseName$;

  protected params$ = this._activatedRoute.params.pipe(
    tap((params) => {
      const id = params['id'];
      this._pokemonsStore.pokemonById(id);
      this._pokemonsStore.japoneseNameById(id);
    })
  );

  ngOnInit(): void {
    this._activatedRoute.params.forEach(console.log);
  }

  getPokemonImage(id: string | number) {
    return environment.pokeImgs.concat(id as string).concat('.svg');
  }

  ngOnDestroy(): void {
    this._pokemonsStore.clearPokemonSelected();
  }
}

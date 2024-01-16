import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonType } from '../../models/pokemon.type';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemons-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemons-card.component.html',
  styleUrls: ['./pokemons-card.component.scss'],
})
export class PokemonsCardComponent {
  @Input() pokemon!: PokemonType;

  private _router = inject(Router);

  get pokemonImage() {
    return environment.pokeImgs
      .concat(this.pokemon.id as string)
      .concat('.svg');
  }

  onClickCardItem(): void {
    this._router.navigate([this.pokemon.id, 'details']);
  }
}

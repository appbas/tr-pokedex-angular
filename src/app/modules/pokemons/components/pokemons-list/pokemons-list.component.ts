import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonsCardComponent } from '../pokemons-card/pokemons-card.component';
import { PokemonsService } from '../../pokemons.service';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [CommonModule, PokemonsCardComponent],
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.scss'],
})
export class PokemonsListComponent {
  private _pokemonService = inject(PokemonsService);

  pokemonsList$ = this._pokemonService.list();
}

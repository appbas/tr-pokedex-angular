import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PokemonsStore } from './store/pokemons.store';

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [PokemonsStore],
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.scss'],
})
export class PokemonsComponent {}

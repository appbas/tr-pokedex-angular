import { Routes } from '@angular/router';
import { PokemonsListComponent } from './components/pokemons-list/pokemons-list.component';

export const routes: Routes = [
  {
    path: '',
    component: PokemonsListComponent,
    children: [],
  },
];

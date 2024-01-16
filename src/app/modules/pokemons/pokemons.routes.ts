import { Routes } from '@angular/router';
import { PokemonsListComponent } from './components/pokemons-list/pokemons-list.component';
import { PokemonsComponent } from './pokemons.component';

export const routes: Routes = [
  {
    path: '',
    component: PokemonsComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/pokemons-list/pokemons-list.component').then(
            (c) => c.PokemonsListComponent
          ),
      },
      {
        path: ':id/details',
        loadComponent: () =>
          import(
            './components/pokemons-details/pokemons-details.component'
          ).then((c) => c.PokemonsDetailsComponent),
      },
    ],
  },
];

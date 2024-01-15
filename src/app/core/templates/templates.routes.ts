import { Routes } from '@angular/router';
import { TemplatesComponent } from './templates.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    providers: [],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/pokemons/pokemons.routes').then(
            (r) => r.routes
          ),
      },
    ],
  },
];

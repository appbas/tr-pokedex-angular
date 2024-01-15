import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pokemons-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pokemons-details.component.html',
  styleUrls: ['./pokemons-details.component.scss'],
})
export class PokemonsDetailsComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);

  protected params$ = this._activatedRoute.params;

  ngOnInit(): void {
    this._activatedRoute.params.forEach(console.log);
  }

  getPokemonImage(id: string) {
    return environment.pokeImgs.concat(id as string).concat('.svg');
  }
}

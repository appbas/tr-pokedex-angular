import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounce, debounceTime, filter, Subject, takeUntil, tap } from 'rxjs';
import { PokemonType } from '../../models/pokemon.type';
import { PokemonsStore } from '../../store/pokemons.store';
import { PokemonsCardComponent } from '../pokemons-card/pokemons-card.component';

@Component({
  selector: 'app-pokemons-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PokemonsCardComponent],
  templateUrl: './pokemons-list.component.html',
  styleUrls: ['./pokemons-list.component.scss'],
})
export class PokemonsListComponent implements OnInit, OnDestroy {
  @ViewChild('pokemonList', { static: true })
  pokemonListElement!: ElementRef<HTMLDivElement>;

  private _pokemonsStore = inject(PokemonsStore);

  pokemonsList$ = this._pokemonsStore.selectPokemons$;
  pokemonNameControl = new FormControl<string>(
    this._pokemonsStore.getPokemonNameSearch()
  );

  private unsubscribe = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.initScreen();
    this.initInputSearch();
  }

  private initScreen(): void {
    this.pokemonListElement.nativeElement.addEventListener(
      'scroll',
      this.onScrollPokemonList.bind(this)
    );
    if (!this._pokemonsStore.hasResult()) {
      this._pokemonsStore.pokemonsSearch();
    }
  }

  private initInputSearch(): void {
    this.pokemonNameControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(400),
        tap((pokemonName) =>
          this._pokemonsStore.searchPokemonByName(pokemonName)
        )
      )
      .subscribe();
  }

  private onScrollPokemonList(): void {
    const t = setTimeout(() => {
      clearTimeout(t);
      const element = this.pokemonListElement.nativeElement;
      const scrollEnd = element.scrollHeight - element.scrollTop;
      const clientHeight = element.clientHeight;

      const quantity = Number((scrollEnd / clientHeight).toPrecision(1));
      const value =
        quantity === 0
          ? scrollEnd
          : scrollEnd / (quantity + (quantity > 1 ? 1 : 0));

      if (
        value >= clientHeight - 50 &&
        this._pokemonsStore.isPokemonSearchNotLoading() &&
        !this._pokemonsStore.isPokemonSearchByName()
      ) {
        this._pokemonsStore.pokemonsSearch();
      }
    }, 100);
  }

  trackByPokemonList(_: number, pokemon: PokemonType): string {
    return pokemon.id as string;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
    this.pokemonListElement.nativeElement.removeEventListener(
      'scroll',
      this.onScrollPokemonList.bind(this)
    );
  }
}

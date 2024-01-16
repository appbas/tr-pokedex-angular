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
  pokemonNameControl = new FormControl<string>('');

  private _pokemonsStore = inject(PokemonsStore);

  pokemonsList$ = this._pokemonsStore.selectPokemons$;

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
    console.log('PokemonsListComponent', 'init');
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
    const element = this.pokemonListElement.nativeElement;
    const scrollEnd = element.scrollHeight - element.scrollTop - 20;
    const clientHeight = element.clientHeight - 20;

    if (
      scrollEnd === clientHeight &&
      this._pokemonsStore.isPokemonSearchNotLoading() &&
      !this._pokemonsStore.isPokemonSearchByName()
    ) {
      this._pokemonsStore.pokemonsSearch();
    }
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
    console.log('PokemonsListComponent', 'destroy');
  }
}

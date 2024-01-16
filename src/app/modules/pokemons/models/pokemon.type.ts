import { PokemonDetailsType } from './pokemon-details.type';
import { PokemonTypesType } from './pokemon-types.type';

export type PokemonType = {
  id: string | number;
  name: string;
  url: string;
  types: PokemonTypesType[] | null;
  stats: PokemonDetailsType[] | null;
  japoneseName: string | null;
};

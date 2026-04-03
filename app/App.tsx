import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PokemonTable from './PokemonTable';
import Details from './Details';
import { TPokemon } from './types';


async function fetchPokemonList() {
  const list = await Promise.all(
    Array.from({ length: 251 }, (_, i) => i + 1).map(async id => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const d = await res.json();
      return {
        id,
        name: d.name,
        sprites: d.sprites,
        types: d.types.map((t: any) => t.type.name),
        height: d.height,
        weight: d.weight,
        stats: d.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        cries: d.cries,
      };
    })
  );
  return list;
}



export default function App() {
  const [selected, setSelected] = useState<TPokemon | null>(null);

  const { data: pokemon = [], isLoading } = useQuery({
    queryKey: ['pokemonList'],
    queryFn: fetchPokemonList,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading) return (
    <div className="loading">
      <div className="spinner" />
      Laster Pokédex...
    </div>
  );

  return (
    <>
      <PokemonTable pokemon={pokemon} setSelected={setSelected} />
      {selected && (
        <Details
          pokemon={selected}
          onClose={() => setSelected(null)}
          onPrev={
            selected.id > 1
              ? () => {
                  const prev = pokemon.find(p => p.id === selected.id - 1);
                  if (prev) setSelected(prev);
                }
              : null
          }
          onNext={
            selected.id < pokemon.length
              ? () => {
                  const next = pokemon.find(p => p.id === selected.id + 1);
                  if (next) setSelected(next);
                }
              : null
          }
        />
      )}
    </>
  );
}

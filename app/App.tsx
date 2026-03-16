import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PokemonTable from './PokemonTable';
import Details from './Details';

async function fetchPokemonList() {
  const list = await Promise.all(
    Array.from({ length: 151 }, (_, i) => i + 1).map(async id => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const d = await res.json();
      return {
        id,
        name: d.name,
        sprite: d.sprites.front_default,
        types: d.types.map(t => t.type.name),
      };
    })
  );
  return list;
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

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
      <PokemonTable pokemon={pokemon} search={search} setSearch={setSearch} setSelected={setSelected} />
      {selected && (
        <Details
          pokemon={selected}
          onClose={() => setSelected(null)}
          onPrev={selected.id > 1 ? () => setSelected(pokemon.find(p => p.id === selected.id - 1)) : null}
          onNext={selected.id < pokemon.length ? () => setSelected(pokemon.find(p => p.id === selected.id + 1)) : null}
        />
      )}
    </>
  );
}
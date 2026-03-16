import { useState } from "react";
import { useEffect } from "react";
import TypeBadge from "./TypeBadge";

type PokemonTableProps = {
  pokemon: any[];
  search: string;
  setSearch: (s: string) => void;
  setSelected: (p: any) => void;
};

export default function PokemonTable({
  pokemon,
  search,
  setSearch,
  setSelected,
}: {
  pokemon: any[];
  search: string;
  setSearch: (s: string) => void;
  setSelected: (p: any) => void;
}) {
  return (
    <>
      <div className="header">LEO OG ELLAS POKEDEX</div>

      <div className="table-container">
        <table>
          <tbody>
            {pokemon.map((p) => (
              <tr key={p.id} onClick={() => setSelected(p)}>
                <td className="number-cell">#{p.id}</td>
                <td>
                  {p.name.toUpperCase()} <br />
                  <TypeBadge type={p.types[0]} />
                </td>
                <td>
                  <img src={p.sprite} alt={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

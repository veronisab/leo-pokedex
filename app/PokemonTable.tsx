import TypeBadge from "./TypeBadge";

type PokemonTableProps = {
  pokemon: any[];
  setSelected: (p: any) => void;
};

export default function PokemonTable({ pokemon, setSelected }: PokemonTableProps) {
  return (
    <>
      <div className="header">LEO OG ELLAS POKEDEX</div>
      <div className="table-container">
        <table>
          <tbody>
            {pokemon.map((p) => (
              <tr key={p.id} onClick={() => setSelected(p)}>
                <td className="number-cell">#{String(p.id).padStart(2,'0')}</td>
                <td>
                  {p.name.toUpperCase()} <br />
                  <TypeBadge type={p.types[0]} />
                </td>
                <td>
                  <img src={p.sprites.front_default} alt={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

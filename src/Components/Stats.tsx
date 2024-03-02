import React from "react";
import "../assets/CSS/index.css";

interface Pokedex {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  stats?: {
    name: string;
    base_stat: number;
  }[];
}

interface StatsProps {
  selectedPokemon: Pokedex | null;
  onClose: () => void;
}

const Stats: React.FC<StatsProps> = ({ selectedPokemon, onClose }) => {
  if (!selectedPokemon) {
    return <div>No data available</div>;
  }

  const upperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section className="statistics">
      <article className="cards">
        <img
          className="card-img"
          src={selectedPokemon?.sprites.front_default || ""}
          alt={`Pokemon Img`}
        />
        <h2>{upperCase(selectedPokemon!.name)} Statistics</h2>
        <p>ID: {selectedPokemon!.id}</p>
        <p>Height: {selectedPokemon!.height}</p>
        <p>Weight: {selectedPokemon!.weight}</p>
        <h3>Stats:</h3>
        <ul>
          {selectedPokemon?.stats?.map((stat, index) => (
            <li key={index}>
              {upperCase(stat.name)}: {stat.base_stat}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="btn-closed">
          Close
        </button>
      </article>
    </section>
  );
};

export default Stats;

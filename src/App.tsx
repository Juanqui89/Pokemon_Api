import axios from "axios";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Stats from "./Components/Stats";

interface Pokemon {
  url: string;
}

interface Stat {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface Pokedex {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  types: Type[];
  stats: {
    name: string;
    base_stat: number;
  }[];
}

const App = () => {
  const [pokeInfo, setPokeInfo] = useState<Pokedex[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokedex | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const fetchPokedex = async () => {
    try {
      const resp = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50"
      );
      const data: Pokemon[] = resp.data.results;

      const allInfo = data.map(async (pokemon) => {
        const resp = await axios.get<Pokedex>(pokemon.url);
        const additionalStats = await axios.get(pokemon.url);
        const stats: Stat[] = additionalStats.data.stats;

        return {
          ...resp.data,
          stats: stats.map((stat) => ({
            name: stat.stat.name,
            base_stat: stat.base_stat,
          })),
        };
      });

      const results = await Promise.all(allInfo);
      setPokeInfo(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPokedex();
  }, []);

  const upperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  const typeUpperCase = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleViewData = (pokemon: Pokedex) => {
    setScrollPosition(window.scrollY);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedPokemon(pokemon);
  };

  const handleCloseStats = () => {
    setSelectedPokemon(null);
    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
  };

  return (
    <>
      <h1>What is that Pokémon?</h1>
      <Container>
        <Row>
          <Col>
            {selectedPokemon && (
              <Stats
                selectedPokemon={selectedPokemon}
                onClose={handleCloseStats}
              />
            )}
            <section className="content">
              {pokeInfo.map((item, index) => (
                <article key={index} className="card">
                  <img
                    className="card-img"
                    src={item.sprites.front_default}
                    alt={`Pokemon ${item.name}`}
                  />
                  <p className="number">
                    #{item.id} {upperCase(item.name)}
                  </p>
                  <article className="btns">
                    <span className="types">
                      {item.types.map((type, typeIndex) => (
                        <button key={typeIndex}>
                          {typeUpperCase(type.type.name)}
                        </button>
                      ))}
                    </span>
                    <button
                      onClick={() => handleViewData(item)}
                      className="data"
                    >
                      View Data
                    </button>
                  </article>
                </article>
              ))}
            </section>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;

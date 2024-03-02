/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import Img from "../assets/Images/PokemonImg.webp";
import { useState, useEffect } from "react";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import Stats from "./Stats";

interface PokemonData {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats?: {
    name: string;
    base_stat: number;
  }[];
}

const Header = () => {
  const [searchInfo, setSearchInfo] = useState("");
  const [searchResults, setSearchResults] = useState<PokemonData | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleSearch = async () => {
    try {
      const resp = await axios.get<PokemonData>(
        `https://pokeapi.co/api/v2/pokemon/${searchInfo}`
      );
      const result = resp.data;
      setSearchResults(result);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleViewData = () => {
    setShowStats(true);
  };

  const upperCase = (name: string | undefined) => {
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
  };

  const typeUpperCase = (typeName: string) => {
    return typeName.charAt(0).toUpperCase() + typeName.slice(1);
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <img src={Img} className="logo" alt="Pokemon image" />
            <form onSubmit={handleSubmit}>
              <article className="form-group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="icon-search"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  type="search"
                  placeholder="Search Pokemon"
                  value={searchInfo}
                  onChange={(e) => setSearchInfo(e.target.value)}
                />
              </article>
              <button type="submit" className="btn-search">
                Search
              </button>
            </form>

            {searchResults && searchResults.name && (
              <section className="content-result">
                <article className="card">
                  <img
                    className="card-img"
                    src={searchResults.sprites?.front_default}
                    alt={`Pokemon ${searchResults.name}`}
                  />
                  <p className="number">
                    #{searchResults.id} {upperCase(searchResults.name)}
                  </p>
                  <article className="btns">
                    <span className="types">
                      {searchResults.types &&
                        searchResults.types.map((type, typeIndex) => (
                          <button key={typeIndex}>
                            {typeUpperCase(type.type.name)}
                          </button>
                        ))}
                    </span>
                    <button className="data" onClick={() => handleViewData}>
                      View Data
                    </button>
                  </article>
                </article>
              </section>
            )}
          </Col>
        </Row>
      </Container>
      {showStats && searchResults && (
        <Stats
          selectedPokemon={searchResults}
          onClose={() => setShowStats(false)}
        />
      )}
      ;
    </>
  );
};

export default Header;

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Pokemon from "../components/Pokemon";

export default function Home({ initialPokemon }) {
  const [pokemon, setPokemon] = useState([]);
  const [offset, setOffset] = useState(0);

  const fetchPokemon = async (url, next) => {
    const response = await fetch(url);
    const nextPokemon = await response.json();

    setOffset(next ? offset + 20 : offset - 20);
    setPokemon(nextPokemon);
    getAllPokemonDetails(nextPokemon);
  };

  const getAllPokemonDetails = async () => {
    const promises = initialPokemon.results.map(async (pokemon) => {
      const response = await fetch(pokemon.url);
      const data = await response.json();

      return data;
    });

    await Promise.all(promises).then((detailResults) => {
      setPokemon([...pokemon, ...detailResults]);
    });

    console.log(pokemon);
  };

  useEffect(() => {
    getAllPokemonDetails();
  }, []);

  return (
    <Layout title="Pokedex">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {pokemon.map((pokemon, index) => (
          <Pokemon key={index} pokemon={pokemon} index={index + offset} />
        ))}
      </div>

      <div className="flex justify-center my-10 gap-5">
        <button
          disabled={!pokemon.previous}
          className="disabled:bg-gray-500 px-3 py-1 bg-slate-900"
          onClick={() => fetchPokemon(pokemon.previous, false)}
        >
          Previous
        </button>
        <button
          disabled={!pokemon.next}
          className="disabled:bg-gray-500 px-3 py-1 bg-slate-900"
          onClick={() => fetchPokemon(pokemon.next, true)}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=905");
  const initialPokemon = await response.json();

  return {
    props: {
      initialPokemon,
    },
  };
}

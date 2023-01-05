import { useState } from "react";
import Layout from "../components/Layout";
import Pokemon from "../components/Pokemon";

export default function Home({ initialPokemon }) {
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [offset, setOffset] = useState(0);

  const fetchPokemon = async (url, next) => {
    const response = await fetch(url);
    const nextPokemon = await response.json();

    setOffset(next ? offset + 20 : offset - 20);
    setPokemon(nextPokemon);
  };

  return (
    <Layout>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {pokemon.results.map((pokemon, index) => (
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
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");
  const initialPokemon = await response.json();

  return {
    props: {
      initialPokemon,
    },
  };
}

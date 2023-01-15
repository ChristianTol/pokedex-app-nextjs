import Image from "next/image";
import { useEffect, useState } from "react";
import Filters from "../components/Filters";
import Layout from "../components/Layout";
import { Loader } from "../components/Loader";
import Pokemon from "../components/Pokemon";

export default function Home({ initialPokemon }) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState({
    region: "all",
    type: "all",
    sortBy: "id",
    searchTerm: "",
  });

  // const fetchPokemon = async (url, next) => {
  //   const response = await fetch(url);
  //   const nextPokemon = await response.json();

  //   setOffset(next ? offset + 20 : offset - 20);
  //   setPokemon(nextPokemon);
  //   getAllPokemonDetails(nextPokemon);
  // };

  const getAllPokemonDetails = async () => {
    const promises = initialPokemon.results.map(async (pokemon) => {
      const response = await fetch(pokemon.url);
      const data = await response.json();

      return data;
    });

    await Promise.all(promises).then((detailResults) => {
      setPokemon([...pokemon, ...detailResults]);
    });

    setLoading(false);

    console.log(pokemon);
  };

  useEffect(() => {
    getAllPokemonDetails();
  }, [loading]);

  return (
    <Layout title="Pokedex">
      <Filters filters={filters} />
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 gap-5 mx-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          {pokemon.map((pokemon, index) => (
            <Pokemon key={index} pokemon={pokemon} index={index + offset} />
          ))}
        </div>
      )}

      {/* <div className="flex justify-center my-10 gap-5">
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
      </div> */}
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

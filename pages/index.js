import Image from "next/image";
import { lazy, useCallback, useEffect, useState } from "react";
import { getPokemonDetails, getPokemonList } from "../components/Api";
import DetailModal from "../components/DetailModal";
import Filters from "../components/Filters";
import Layout from "../components/Layout";
import { Loader } from "../components/Loader";
import Pokemon from "../components/Pokemon";
import { POKEMON_PER_LOAD, REGION_INFO } from "../constants/constants";

export default function Home({ initialPokemon }) {
  const [numPokemon, setNumPokemon] = useState(20);
  const [loading, setLoading] = useState(true);
  const [infiniteLoading, setInfiniteLoading] = useState(true);
  const [allPokemonDetails, setAllPokemonDetails] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [filters, setFilters] = useState({
    region: "all",
    type: "all",
    sortBy: "number",
    searchTerm: "",
  });

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPokemon, setDetailPokemon] = useState({});

  const [shinyStates, setShinyStates] = useState({});

  const toggleShiny = (pokemonId) => {
    setShinyStates(prevState => ({
      ...prevState,
      [pokemonId]: !prevState[pokemonId]
    }));
  };

  // Load all Pokemon
  useEffect(() => {
    const getAllPokemonDetails = async () => {
      const pokemonList = await getPokemonList(
        "https://pokeapi.co/api/v2/pokemon?limit=1025"
      );

      const allResponses = await Promise.all(
        pokemonList.map((pokemon) => getPokemonDetails(pokemon.url))
      );

      setAllPokemonDetails(allResponses);
      setDisplayedPokemon(allResponses);
      setLoading(false);
    };

    getAllPokemonDetails();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.offsetHeight
    ) {
      localStorage.setItem("scrollPosition", window.scrollY.toString());
      setTimeout(() => {
        setInfiniteLoading(true);
        loadMorePokemon();
      }, 500);
      setInfiniteLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [numPokemon, infiniteLoading]);

  // Filters
  useEffect(() => {
    const start = REGION_INFO[filters.region].start;
    const limit = REGION_INFO[filters.region].limit;
    const filteredPokemon = allPokemonDetails
      .slice(start, start + limit)
      .filter((pokemon) => {
        return (
          filters.type === "all" ||
          pokemon?.types?.map((type) => type?.type?.name).includes(filters.type)
        );
      })
      .filter((pokemon) => {
        return pokemon?.species?.name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      });

    // Sort by
    if (filters.sortBy === "Number (Low-High)") {
      filteredPokemon.sort((p1, p2) => p1.id - p2.id);
    }

    if (filters.sortBy === "Number (High-Low)") {
      filteredPokemon.sort((p1, p2) => p2.id - p1.id);
    }

    if (filters.sortBy === "A-Z") {
      filteredPokemon.sort((p1, p2) =>
        p1.species?.name.localeCompare(p2.species?.name)
      );
    }

    if (filters.sortBy === "Z-A") {
      filteredPokemon.sort((p1, p2) =>
        p2.species?.name.localeCompare(p1.species?.name)
      );
    }

    setDisplayedPokemon(filteredPokemon);

    setNumPokemon(20);
  }, [allPokemonDetails, filters]);

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const loadMorePokemon = () => {
    setNumPokemon(numPokemon + POKEMON_PER_LOAD);
  };

  return (
    <>
      <Layout title="Pokédex">
        <Filters filters={filters} updateFilters={updateFilters} />
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 gap-5 mx-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-10">
            {displayedPokemon.slice(0, numPokemon).map((pokemon) => (
              <Pokemon
                key={pokemon.id}
                pokemon={pokemon}
                updateFilters={updateFilters}
                filters={filters}
                setInfiniteLoading={setInfiniteLoading}
                loadMorePokemon={loadMorePokemon}
                detailPokemon={detailPokemon}
                setDetailPokemon={setDetailPokemon}
                allPokemonDetails={allPokemonDetails}
                shinyStates={shinyStates}
                toggleShiny={toggleShiny}
              />
            ))}
          </div>
        )}

        {infiniteLoading ||
          (numPokemon < displayedPokemon.length && (
            <div className="flex justify-center my-10">
              <Loader />
            </div>
          ))}
      </Layout>

      {!loading && (
        <a
          href="#"
          className="top bg-slate-800 border-slate-900 border-2 text-amber-400 font-semibold bottom-0 p-3 rounded-xl left-[150px] lg:bottom-5 lg:left-[350px]"
        >
          Back to Top &#8593;
        </a>
      )}
    </>
  );
}

// export async function getStaticProps() {
//   const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=905");
//   const initialPokemon = await response.json();

//   return {
//     props: {
//       initialPokemon,
//     },
//   };
// }

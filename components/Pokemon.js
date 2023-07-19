import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { capitalizeFirstLetter } from "../helper/helper";
import { TYPE_COLORS, TYPE_SECONDARY_COLORS } from "../constants/constants";

const Pokemon = ({
  pokemon,
  toggleModal,
  updateFilters,
  filters,
  setInfiniteLoading,
  loadMorePokemon,
}) => {
  const pokeIndex = ("000" + pokemon.id).slice(pokemon.id > 999 ? -4 : -3);
  const [shiny, setShiny] = useState(false);
  const [currentRegion, setCurrentRegion] = useState("all");
  // const [changeImage, setChangeImage] = useState(false);

  const typeColorGradient = getTypeColorGradient(pokemon.types);

  return (
    <div
      className="rounded-md p-5 hover:scale-110 ease-in-out duration-200 flex flex-col justify-center items-center relative cursor-pointer shadow"
      style={{
        background: `radial-gradient(circle at top, ${typeColorGradient[0]} 35%, ${typeColorGradient[1]}) 100%`,
      }}
    >
      <button
        onClick={() => setShiny(!shiny)}
        className="absolute top-1 right-1 rounded-md flex"
      >
        <Image
          src={shiny ? "/sparkles-shiny.png" : "/sparkles-white.png"}
          alt="shiny"
          width={35}
          height={35}
        />
      </button>
      <span
        onClick={(e) => {
          const targetScrollElement = e.currentTarget;
          const scrollContainer = document.documentElement || document.body;
          const scrollPosition = scrollContainer.scrollTop;
          const newRegion =
            pokeIndex >= 1 && pokeIndex <= 151
              ? "kanto"
              : pokeIndex >= 152 && pokeIndex <= 251
              ? "johto"
              : pokeIndex >= 252 && pokeIndex <= 368
              ? "hoenn"
              : pokeIndex >= 369 && pokeIndex <= 493
              ? "sinnoh"
              : pokeIndex >= 494 && pokeIndex <= 649
              ? "unova"
              : pokeIndex >= 650 && pokeIndex <= 721
              ? "kalos"
              : pokeIndex >= 722 && pokeIndex <= 809
              ? "alola"
              : pokeIndex >= 810 && pokeIndex <= 898
              ? "galar"
              : pokeIndex >= 899 && pokeIndex <= 905
              ? "hisui"
              : pokeIndex >= 900 && pokeIndex <= 1010
              ? "paldea"
              : "all";
          const currentRegion = filters.region;

          if (currentRegion !== newRegion) {
            const scrollPositions =
              JSON.parse(localStorage.getItem("scrollPositions")) || {};
            scrollPositions[currentRegion] = scrollPosition;
            localStorage.setItem(
              "scrollPositions",
              JSON.stringify(scrollPositions)
            );
          }

          const updatedRegion = newRegion === currentRegion ? "all" : newRegion;
          updateFilters({ region: updatedRegion });

          if (updatedRegion !== "all") {
            const scrollPositions =
              JSON.parse(localStorage.getItem("scrollPositions")) || {};
            const restoredScrollPosition = scrollPositions[updatedRegion] || 0;

            // Wait for the browser to render the updated content before scrolling
            setTimeout(() => {
              scrollContainer.scrollTop =
                restoredScrollPosition +
                targetScrollElement.getBoundingClientRect().top;
            }, 0);
          } else {
            const storedScrollPositions =
              JSON.parse(localStorage.getItem("scrollPositions")) || {};
            const restoredScrollPosition =
              storedScrollPositions[updatedRegion] || 0;

            // Restore infinite scroll and load from the previous position
            setTimeout(() => {
              setInfiniteLoading(true);
              loadMorePokemon(restoredScrollPosition);
            }, 500);
            setInfiniteLoading(false);
          }
        }}
        className="absolute text-2xl top-1 left-3 font-bold"
      >
        No. {pokeIndex}
      </span>

      <div className="mt-3" onClick={() => toggleModal(pokemon)}>
        <LazyLoadImage
          className="w-[180px] h-[180px] md:w-[250px] sm:h-[250px]"
          src={
            shiny
              ? pokemon.sprites.other["official-artwork"].front_shiny
              : pokemon.sprites.other["official-artwork"].front_default
          }
          alt={pokemon.name}
          effect="blur"
        />
      </div>
      <div className="gap-2 flex my-2">
        {pokemon.types?.map((type, index) => (
          <span
            key={type.type.name}
            className="px-2 py-1 rounded flex items-center justify-center"
            onClick={(e) => {
              const newType = type.type.name;
              const currentType = filters.type;
              const updatedType = newType === currentType ? "all" : newType;
              updateFilters({ type: updatedType });
            }}
          >
            <div
              className={`${type.type.name} rounded-l m-[-8px]`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)", // Apply the diagonal shape with overlap
              }}
            >
              <div className="h-[32px] w-[45px] flex items-center justify-center pr-[10px]">
                <Image
                  className=""
                  src={`/icons/${type.type.name}.svg`}
                  alt={`${type.type.name}`}
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div
              className="h-[32px] w-[90px] flex items-center justify-center m-[-8px] rounded-r bg-slate-800 font-bold"
              style={{
                clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)", // Apply the diagonal shape with overlap
                // fontWeight: 700,
              }}
            >
              <p className="hidden md:inline uppercase px-[8px]">
                {capitalizeFirstLetter(type.type.name)}
              </p>
            </div>
          </span>
        ))}
      </div>
      <span className="font-semibold tracking-wider text-yellow">
        {capitalizeFirstLetter(pokemon.name)}
      </span>
    </div>
  );
};

export const getTypeColorGradient = (typesArray) => {
  if (typesArray.length === 1) {
    return [
      TYPE_COLORS[typesArray[0].type.name],
      TYPE_SECONDARY_COLORS[typesArray[0].type.name],
    ];
  } else {
    return [
      TYPE_COLORS[typesArray[0].type.name],
      TYPE_COLORS[typesArray[1].type.name],
    ];
  }
};

export default Pokemon;

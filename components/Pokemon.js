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
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
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
              : pokeIndex >= 900 && pokeIndex <= 1025
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
        style={{textShadow: '1px 1px 1px black'}}
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
      <div className="gap-2 my-2 flex md:block xl:flex">
        {pokemon.types?.map((type, index) => (
          <span
            key={type.type.name}
            className={`px-2 py-0 md:py-3 rounded flex items-center justify-center sm:py-1 sm:gap-1
            ${isMobile && type.type.name}`}
            onClick={(e) => {
              const newType = type.type.name;
              const currentType = filters.type;
              const updatedType = newType === currentType ? "all" : newType;
              updateFilters({ type: updatedType });
            }}
          >
            <div className="md:hidden">
              <Image
                src={`/icons/${type.type.name}.svg`}
                alt={`${type.type.name}`}
                width={15}
                height={15}
              />
            </div>
            <div className="hidden md:flex">
              <div
                className={`${type.type.name} rounded-l m-[-8px] [clip-path:polygon(0%_0%,100%_0%,80%_100%,0%_100%)]`}
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
                className={`h-[32px] w-[90px] flex items-center justify-center m-[-8px] rounded-r ${type.type.name}-text font-bold [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)]`}
              >
                <h6 className="hidden md:inline uppercase px-[8px]">
                  {capitalizeFirstLetter(type.type.name)}
                </h6>
              </div>
            </div>
          </span>
        ))}
      </div>
      <span className="font-semibold tracking-wider text-yellow" style={{textShadow: '1px 1px 1px black'}}>
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

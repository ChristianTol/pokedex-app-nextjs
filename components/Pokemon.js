import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { capitalizeFirstLetter } from "../helper/helper";
import { TYPE_COLORS, TYPE_SECONDARY_COLORS } from "../constants/constants";

const Pokemon = ({ pokemon }) => {
  const pokeIndex = ("000" + pokemon.id).slice(pokemon.id > 999 ? -4 : -3);
  const [shiny, setShiny] = useState(false);
  // const [changeImage, setChangeImage] = useState(false);

  const typeColorGradient = getTypeColorGradient(pokemon.types);

  console.log(pokemon);

  return (
    <div
      className="rounded-md p-5 hover:scale-110 ease-in-out duration-200 flex flex-col justify-center items-center relative cursor-pointer"
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
      <span className="absolute text-2xl top-1 left-3 font-bold">
        No. {pokeIndex}
      </span>
      <div className="mt-3">
        <Link href={`/pokemon/${pokemon.name}`} passHref>
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
        </Link>
      </div>
      <div className="flex gap-2 my-2">
        {pokemon.types?.map((type) => (
          <span
            key={type.type.name}
            className={`px-2 py-1 gap-1 rounded flex bg-white ${type.type.name}`}
          >
            <Image
              src={`/icons/${type.type.name}.svg`}
              alt={`${type.type.name}`}
              width={15}
              height={15}
            />
            <p className="hidden md:inline">
              {capitalizeFirstLetter(type.type.name)}
            </p>
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

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { capitalizeFirstLetter } from "../helper/helper";
import { TYPE_COLORS, TYPE_SECONDARY_COLORS } from "../constants/constants";

const Pokemon = ({ pokemon, index }) => {
  const pokeIndex = ("000" + (index + 1)).slice(-3);

  const typeColorGradient = getTypeColorGradient(pokemon.types);

  console.log(pokemon);

  return (
    <Link href={`/pokemon/${pokemon.name}`} passHref>
      <div
        className="rounded p-5 flex flex-col justify-center items-center relative cursor-pointer"
        style={{
          background: `radial-gradient(circle at top, ${typeColorGradient[0]} 35%, ${typeColorGradient[1]}) 100%`,
        }}
      >
        <span className="absolute text-2xl top-1 left-3 font-bold">
          No. {pokeIndex}
        </span>
        <div className="mt-3">
          <LazyLoadImage
            src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokeIndex}.png`}
            alt={pokemon.name}
            width={250}
            height={250}
            effect="blur"
          />
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
                width={20}
                height={20}
                effect="blur"
              />
              {capitalizeFirstLetter(type.type.name)}
            </span>
          ))}
        </div>
        <span className="font-semibold tracking-wider text-yellow">
          {capitalizeFirstLetter(pokemon.name)}
        </span>
      </div>
    </Link>
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

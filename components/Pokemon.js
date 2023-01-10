import Image from "next/image";
import Link from "next/link";
import React from "react";
import { capitalizeFirstLetter } from "../helper/helper";

const Pokemon = ({ pokemon, index }) => {
  const pokeIndex = ("000" + (index + 1)).slice(-3);

  return (
    <Link href={`/pokemon/${pokemon.name}`} passHref>
      <div className="bg-slate-900 rounded p-5 flex flex-col justify-center items-center relative cursor-pointer">
        <span className="absolute text-2xl text-slate-500 top-1 left-3 font-bold">
          No. {pokeIndex}
        </span>
        <div className="mt-3">
          <Image
            src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokeIndex}.png`}
            alt={pokemon.name}
            width={150}
            height={150}
          />
        </div>
        <span className="font-semibold tracking-wider text-yellow">
          {capitalizeFirstLetter(pokemon.name)}
        </span>
      </div>
    </Link>
  );
};

export default Pokemon;

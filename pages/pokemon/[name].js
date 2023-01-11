import Image from "next/image";
import React from "react";
import Layout from "../../components/Layout";
import { capitalizeFirstLetter } from "../../helper/helper";

const Pokemon = ({ pokemon }) => {
  const pokeIndex = ("000" + pokemon.id).slice(-3);

  const STAT_NAMES = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  };

  const renderTypes = () =>
    pokemon.types.map((type) => (
      <li
        key={type.slot}
        className={`px-2 py-1 flex gap-1 rounded ${type.type.name}`}
      >
        <Image
          src={`/icons/${type.type.name}.svg`}
          alt={`${type.type.name}`}
          width={20}
          height={20}
        />
        {capitalizeFirstLetter(type.type.name)}
      </li>
    ));

  const renderStats = () =>
    pokemon.stats.map((stat, index) => {
      return (
        <div className="flex justify-center items-center" key={index}>
          <div className="w-[100px]">
            <h1 className="font-semibold">{STAT_NAMES[stat.stat.name]}</h1>
          </div>
          <div className="grow-[2] bg-slate-700 text-black font-bold my-2 rounded-xl">
            <div
              className={`animate-[statSlideIn_3.5s_ease-in-out] flex justify-center rounded-xl ${stat.stat.name}`}
              style={{
                width: `${(stat.base_stat / 255) * 100}%`,
              }}
            >
              <p>{stat.base_stat}</p>
            </div>
          </div>
        </div>
      );
    });

  return (
    <Layout title={capitalizeFirstLetter(pokemon.name)}>
      <div className="flex flex-col justify-center items-center">
        <span className="absolute text-[300px] font-bold text-slate-500">
          No. {pokeIndex}
        </span>
        <Image
          src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokeIndex}.png`}
          alt={pokemon.name}
          width={400}
          height={400}
        />
      </div>

      <div className="bg-slate-900 rounded p-5">
        <p className="text-2xl mb-3 font-semibold">Types</p>
        <ul className="flex gap-3 mb-10">{renderTypes()}</ul>
        <p className="text-2xl mb-2 font-semibold">Basic Statistics</p>
        <div>{renderStats()}</div>
      </div>
    </Layout>
  );
};

export default Pokemon;

export async function getServerSideProps(context) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${context.query.name}`
  );
  const pokemon = await response.json();

  return {
    props: {
      pokemon,
    },
  };
}

import Image from "next/image";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatPokemonName } from "./Api";

const SpriteInfo = ({ pokemonDetails, shiny, loading, speciesInfo }) => {
  return (
    <div className="info-box-sprite info-text">
      <h4 className="font-bold">
        {"No. " + ("00" + pokemonDetails.id).slice(-3)}
      </h4>
      {/* <img
            className="pokeball-icon"
            src={pokeballIcon}
            alt="pokeball icon"
          /> */}
      <div className="modal-sprite-container" onClick={() => setShiny(!shiny)}>
        <LazyLoadImage
          className="pokemon-sprite"
          src={
            shiny
              ? pokemonDetails.sprites.other["official-artwork"].front_shiny
              : pokemonDetails.sprites.other["official-artwork"].front_default
          }
          alt={pokemonDetails.name}
          effect="blur"
        />
      </div>
      <h3 className="tracking-wider">
        {formatPokemonName(pokemonDetails.species.name)}
      </h3>
      <div className="pokemon-genera">
        {loading
          ? "Loading..."
          : speciesInfo.genera[
              pokemonDetails.id >= 899 && pokemonDetails.id <= 905 ? 4 : 7
            ].genus}
      </div>
      <div className="flex gap-2 my-2">
        {pokemonDetails.types?.map((type) => (
          <span
            key={type.type.name}
            className={`px-2 py-1 gap-1 rounded flex font-normal bg-white ${type.type.name}`}
          >
            <Image
              src={`/icons/${type.type.name}.svg`}
              alt={`${type.type.name}`}
              width={15}
              height={15}
            />
            <p className="hidden md:inline">
              {formatPokemonName(type.type.name)}
            </p>
          </span>
        ))}
      </div>
      <div className="pokemon-dimensions">
        <div className="pokemon-height">
          <h5>Height</h5>
          <span>{pokemonDetails.height / 10}m</span>
        </div>
        <div className="pokemon-weight">
          <h5>Weight</h5>
          <span>{pokemonDetails.weight / 10}kg</span>
        </div>
      </div>
      <div className="pokemon-gender">
        <h5>Gender Ratio</h5>
        <div className="gender-ratio-container">
          {loading ? (
            <span>Loading...</span>
          ) : speciesInfo.gender_rate === -1 ? (
            <span>Gender Unknown</span>
          ) : (
            <>
              <div
                className="gender-ratio-segment"
                style={{
                  backgroundColor: "#3355FF",
                  width: `${100 - speciesInfo.gender_rate * 12.5}%`,
                  borderRadius:
                    speciesInfo.gender_rate === 0 ? "1rem" : "1rem 0 0 1rem",
                }}
              ></div>
              <div
                className="gender-ratio-segment"
                style={{
                  backgroundColor: "#FF77DD",
                  width: `${speciesInfo.gender_rate * 12.5}%`,
                  borderRadius:
                    speciesInfo.gender_rate === 8 ? "1rem" : "0 1rem 1rem 0",
                }}
              ></div>
            </>
          )}
        </div>
        <div
          className="gender-percentages"
          style={{
            opacity: loading ? 0 : speciesInfo.gender_rate === -1 ? 0 : 1,
          }}
        >
          <span style={{ color: "#6982ff" }}>
            {loading ? "-" : 100 - speciesInfo.gender_rate * 12.5}% male,{" "}
          </span>
          <span style={{ color: "#FF77DD" }}>
            {loading ? "-" : speciesInfo.gender_rate * 12.5}% female
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpriteInfo;

import Image from "next/image";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatPokemonName } from "./Api";
import FormSelector from "./FormSelector";

const SpriteInfo = ({
  pokemonDetails,
  shiny,
  setShiny,
  loading,
    handleFormSelect,
  speciesInfo,
}) => {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const pokeIndex = ("00000" + pokemonDetails.id).slice(
        pokemonDetails.id > 9999 ? -5 :
            pokemonDetails.id > 999 ? -4 : -3
    );
  return (
    <div className="info-box-sprite info-text">
        <FormSelector
            speciesInfo={speciesInfo}
            onFormSelect={handleFormSelect}
            currentPokemonId={pokemonDetails.id}
        />
      <h4 className="font-bold">
        {"No. " + pokeIndex}
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
        {formatPokemonName(pokemonDetails?.species?.name)}
      </h3>
      {loading
        ? "Loading..."
        : <p>{speciesInfo?.genera?.[
            pokemonDetails.id >= 899 && pokemonDetails.id <= 905
              ? 5
              : pokemonDetails.id >= 906 && pokemonDetails.id <= 1025
              ? 3
              : 7
          ]?.genus}</p>}

      <div className="flex gap-4 my-2 justify-center">
        {pokemonDetails.types?.map((type) => (
          <span
            key={type.type.name}
            className={`px-2 py-3 rounded flex items-center justify-center`}
          >
            <div className="flex">
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
                <h6 className="inline uppercase px-[8px]">
                  {formatPokemonName(type.type.name)}
                </h6>
              </div>
            </div>
          </span>
        ))}
      </div>
      <div className="pokemon-dimensions">
        <div className="pokemon-height">
          <h5>Height</h5>
          <span>{(pokemonDetails.height / 10).toFixed(1)} m</span>
        </div>
        <div className="pokemon-weight">
          <h5>Weight</h5>
          <span>{pokemonDetails.weight / 10} kg</span>
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

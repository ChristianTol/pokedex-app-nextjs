import React, { useState, useEffect, useRef } from "react";
import {
  getPokemonDetails,
  formatPokemonName,
  formatStatName,
  getPokemonEvolutions,
} from "./Api";
import { getTypeColorGradient } from "./Pokemon";
import { TYPE_COLORS, STAT_COLORS, SORT_BY } from "../constants/constants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import pokeballIcon from "../assets/img/pokeball-icon.png";
// import loadingIcon from "../assets/img/pikachu-running.gif";
import { Loader } from "./Loader";
import Image from "next/image";
import axios from "axios";

const DetailModal = ({ detailPokemon, allPokemonDetails, toggleModal }) => {
  const modalBackground = useRef();
  const [pokemonDetails, setPokemonDetails] = useState(detailPokemon);
  const [speciesInfo, setSpeciesInfo] = useState();
  const [evolutionInfo, setEvolutionInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [shiny, setShiny] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    const getSpeciesInfo = async () => {
      const speciesData = await getPokemonDetails(pokemonDetails.species.url);
      setSpeciesInfo(speciesData);

      const evolutionData = await getPokemonEvolutions(
        speciesData.evolution_chain.url
      );

      setEvolutionInfo(evolutionData);

      console.log(evolutionData);

      setLoading(false);
    };

    pokemonDetails.abilities.map((a) => {
      bringAbilityInfo(a.ability.name, a.slot, a.is_hidden, a.ability.url);
      abilities.sort((a, b) => a.slot - b.slot);
    });

    setAbilities([]);

    if (window.innerWidth < 720) {
      setMobile(true);
    } else {
      setMobile(false);
    }

    setLoading(true);
    if (pokemonDetails != null) {
      getSpeciesInfo();
    }
  }, [pokemonDetails]);

  const handleBackgroundClick = (e) => {
    if (e.target === modalBackground.current) {
      toggleModal();
    }
  };

  console.log(evolutionInfo);

  const bringAbilityInfo = (abilityName, slot, isHidden, abilityURL) => {
    // setModal(true);
    axios.get(abilityURL).then((res) => {
      res.data.effect_entries.forEach((a) => {
        if (a.language.name === "en") {
          setAbilities((abilities) => [
            ...abilities,
            {
              name: abilityName,
              slot: slot,
              isHidden: isHidden,
              effect: a.effect,
            },
          ]);

          return;
        }
      });
    });
  };

  const getShortDescription = (desc) => {
    const splitDesc = desc.split(".");
    const dotCount = desc.split(".").length;

    const twoSentences = splitDesc.slice(0, 2).join(".");
    const threeSentences = splitDesc.slice(0, 3).join(".");
    const fourSentences = splitDesc.slice(0, 4).join(".");
    const lastCharacter = twoSentences.charAt(twoSentences.length - 1);
    const nextCharacter = threeSentences.charAt(twoSentences.length + 1);

    let shortDesc;

    if (lastCharacter === "e" && nextCharacter === "g") {
      shortDesc = fourSentences + ".";
    } else if (isNaN(lastCharacter) === false && dotCount >= 3) {
      shortDesc = threeSentences + ".";
    } else if (isNaN(lastCharacter) === true && dotCount >= 3) {
      shortDesc = twoSentences + ".";
    } else {
      shortDesc = twoSentences;
    }

    return shortDesc;
  };

  const typeColorGradient = getTypeColorGradient(pokemonDetails.types);

  const changeCurrentPokemon = (pokemonId) => {
    setPokemonDetails(allPokemonDetails[pokemonId - 1]);
    setActive(true);
  };

  return (
    <div
      ref={modalBackground}
      className="modal-background"
      onClick={handleBackgroundClick}
    >
      <div
        className="modal-container"
        style={{
          background: `linear-gradient(${typeColorGradient[0]} 35%, ${typeColorGradient[1]}) 100%`,
        }}
      >
        <div className="info-box-sprite info-text">
          <h4 className="font-bold">
            {"No. " + ("00" + pokemonDetails.id).slice(-3)}
          </h4>
          {/* <img
            className="pokeball-icon"
            src={pokeballIcon}
            alt="pokeball icon"
          /> */}
          <div
            className="modal-sprite-container"
            onClick={() => setShiny(!shiny)}
          >
            <LazyLoadImage
              className="pokemon-sprite"
              src={
                shiny
                  ? pokemonDetails.sprites.other["official-artwork"].front_shiny
                  : pokemonDetails.sprites.other["official-artwork"]
                      .front_default
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
                        speciesInfo.gender_rate === 0
                          ? "1rem"
                          : "1rem 0 0 1rem",
                    }}
                  ></div>
                  <div
                    className="gender-ratio-segment"
                    style={{
                      backgroundColor: "#FF77DD",
                      width: `${speciesInfo.gender_rate * 12.5}%`,
                      borderRadius:
                        speciesInfo.gender_rate === 8
                          ? "1rem"
                          : "0 1rem 1rem 0",
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
        <div className="info-box-right">
          <div className="pokemon-description right-section">
            <h5 className="text-[1rem] md:text[1.1rem] font-bold">
              Description
            </h5>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <p className="mb-5">
                {
                  speciesInfo.flavor_text_entries
                    .slice()
                    .reverse()
                    .find((flavor) => flavor.language.name === "en").flavor_text
                }
              </p>
            )}
          </div>
          {abilities.length > 0 && (
            <div className="pokemon-abilities right-section">
              <h5 className="text-[1rem] md:text[1.1rem] mb-2 font-bold">
                Abilities
              </h5>
              <div>
                {abilities.map((ability, index) => (
                  <>
                    <div key={index} className="mb-5">
                      <h6 className="text-[0.9rem] md:text-[0.9rem] font-semibold">
                        {ability.isHidden
                          ? formatPokemonName(ability.name) + " " + "(Hidden)"
                          : formatPokemonName(ability.name)}
                      </h6>
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <p>{getShortDescription(ability.effect)}</p>
                      )}
                    </div>
                  </>
                ))}
              </div>
            </div>
          )}
          <div className="pokemon-stats right-section">
            <h5 className="text-[1rem] md:text[1.1rem] font-bold">
              Basic Statistics
            </h5>
            <div className="parameter-container">
              {pokemonDetails.stats.map((stat) => {
                return (
                  <div key={stat.stat.name} className="parameter-section">
                    <h6 className="info-text text-[0.7rem] md:text-[0.9rem]">
                      {formatStatName(stat.stat.name)}
                    </h6>
                    <div className="statbar-container">
                      <div
                        className="statbar-segment"
                        style={{
                          backgroundColor: STAT_COLORS[stat.stat.name],
                          width: `${(stat.base_stat / 255) * 100}%`,
                        }}
                      >
                        <span className="text-black font-bold">
                          {stat.base_stat}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pokemon-evolution right-section">
            <h5 className="text-[1rem] md:text[1.1rem] font-bold">Evolution</h5>
            <div className="flex flex-col items-center md:flex md:flex-row md:justify-center">
              {!loading ? (
                evolutionInfo.map((column, i) => (
                  <React.Fragment key={i}>
                    <div
                      className={`evolution-column ${
                        column.length === 2
                          ? "two-items"
                          : column.length > 2
                          ? "more-items"
                          : ""
                      }`}
                    >
                      {column.map((item) => (
                        <>
                          <div className="flex justify-center items-center flex-col">
                            <div
                              key={item.id}
                              className={`evolution-item ${
                                active && "scale-120"
                              }`}
                              onClick={() => changeCurrentPokemon(item.id)}
                            >
                              <div className="evolution-sprite-container">
                                <LazyLoadImage
                                  className="evolution-sprite"
                                  src={
                                    allPokemonDetails[item.id - 1].sprites
                                      .other["official-artwork"].front_default
                                  }
                                  alt={allPokemonDetails[item.id - 1].name}
                                  effect="blur"
                                />
                              </div>
                            </div>
                            {item.min_level === 1 &&
                              !mobile &&
                              evolutionInfo.length > 1 && <p>Level 1</p>}
                            {item.trigger_name === "level-up" &&
                              item.min_level !== null && (
                                <p>At level {item.min_level}</p>
                              )}
                            {item.trigger_name === "level-up" &&
                              item.location !== null && (
                                <p>
                                  Level up at{" "}
                                  {formatPokemonName(item.location.name)}
                                </p>
                              )}
                            {item.trigger_name === "use-item" && (
                              <p>{formatPokemonName(item.item.name)}</p>
                            )}
                            {item.trigger_name === "trade" &&
                              item.held_item === null && (
                                <p>{formatStatName(item.trigger_name)}</p>
                              )}

                            {item.trigger_name === "trade" &&
                              item.held_item !== null && (
                                <p>
                                  {formatStatName(item.trigger_name)} holding (
                                  {formatPokemonName(item.held_item.name)})
                                </p>
                              )}
                            {item.min_happiness != null &&
                              item.time_of_day != "" && (
                                <p>
                                  {item.min_happiness}+ Hapiness during{" "}
                                  {item.time_of_day}
                                </p>
                              )}
                            {item.min_happiness != null &&
                              item.time_of_day === "" && (
                                <p>{item.min_happiness}+ Hapiness</p>
                              )}
                            {item.known_move_type != null && (
                              <p>
                                {formatPokemonName(item.known_move_type.name)}{" "}
                                Move
                              </p>
                            )}
                          </div>
                        </>
                      ))}
                    </div>
                    {i + 1 !== evolutionInfo.length && (
                      <div className="evolution-arrow">
                        {mobile ? <span>&#11015;</span> : <span>&#10145;</span>}
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
        <button className="modal-close" onClick={toggleModal}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default DetailModal;

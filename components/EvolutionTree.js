import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatPokemonName, formatStatName } from "./Api";
import { Loader } from "./Loader";

const EvolutionTree = ({
  loading,
  evolutionInfo,
  active,
  allPokemonDetails,
  mobile,
  setPokemonDetails,
  setActive,
}) => {
  const changeCurrentPokemon = (pokemonId) => {
    setPokemonDetails(allPokemonDetails[pokemonId - 1]);
    setActive(true);
  };

  return (
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
                        className={`evolution-item ${active && "scale-120"}`}
                        onClick={() => changeCurrentPokemon(item.id)}
                      >
                        <div className="evolution-sprite-container">
                          <LazyLoadImage
                            className="evolution-sprite"
                            src={
                              allPokemonDetails[item.id - 1].sprites.other[
                                "official-artwork"
                              ].front_default
                            }
                            alt={allPokemonDetails[item.id - 1].name}
                            effect="blur"
                          />
                        </div>
                      </div>
                      <p className="text-[0.8rem] md:text-[0.9rem] font-semibold">
                        {formatPokemonName(item.species_name)}
                      </p>
                      {item.min_level === 1 && evolutionInfo.length > 1 && (
                        <p>Level 1</p>
                      )}
                      {item.trigger_name === "level-up" &&
                        item.min_level !== null &&
                        !item.needs_overworld_rain && (
                          <p>At level {item.min_level}</p>
                        )}
                      {item.trigger_name === "level-up" &&
                        item.location !== null && (
                          <p>
                            Level up at {formatPokemonName(item.location.name)}
                          </p>
                        )}
                      {item.trigger_name === "level-up" &&
                        item.needs_overworld_rain && (
                          <p>
                            At level {item.min_level} level up while raining
                          </p>
                        )}
                      {item.trigger_name === "level-up" &&
                        item.held_item !== null &&
                        item.time_of_day !== "" && (
                          <p>
                            Level up holding (
                            {formatPokemonName(item.held_item.name)}) during{" "}
                            {item.time_of_day}
                          </p>
                        )}
                      {item.trigger_name === "level-up" &&
                        item.held_item !== null &&
                        item.time_of_day === "" && (
                          <p>
                            Level up holding (
                            {formatPokemonName(item.held_item.name)})
                          </p>
                        )}
                      {item.trigger_name === "level-up" &&
                        item.known_move !== null && (
                          <p>
                            Level up knowing (
                            {formatPokemonName(item.known_move.name)})
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
                      {item.min_happiness != null && item.time_of_day != "" && (
                        <p>
                          {item.min_happiness}+ Happiness during{" "}
                          {item.time_of_day}
                        </p>
                      )}
                      {item.min_happiness != null &&
                        item.time_of_day === "" && (
                          <p>{item.min_happiness}+ Happiness</p>
                        )}
                      {item.known_move_type != null && (
                        <p>
                          Level up knowing a {item.known_move_type.name} type
                          move
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
  );
};

export default EvolutionTree;

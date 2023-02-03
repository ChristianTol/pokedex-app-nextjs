import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatPokemonName } from "./Api";

const Abilities = ({ loading, pokemonDetails, speciesInfo }) => {
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    pokemonDetails.abilities.map((a) => {
      bringAbilityInfo(a.ability.name, a.slot, a.is_hidden, a.ability.url);
      abilities.sort((a, b) => a.slot - b.slot);
    });

    setAbilities([]);
  }, [pokemonDetails]);

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

  return (
    <>
      <div className="pokemon-description right-section">
        <h5 className="text-[1rem] md:text[1.1rem] font-bold">Description</h5>
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
    </>
  );
};

export default Abilities;

import React, { useState, useEffect, useRef } from "react";
import { getPokemonDetails, getPokemonEvolutions } from "./Api";
import { getTypeColorGradient } from "./Pokemon";
import "react-lazy-load-image-component/src/effects/blur.css";
// import pokeballIcon from "../assets/img/pokeball-icon.png";
// import loadingIcon from "../assets/img/pikachu-running.gif";
import SpriteInfo from "./SpriteInfo";
import Abilities from "./Abilities";
import BaseStats from "./BaseStats";
import EvolutionTree from "./EvolutionTree";

const DetailModal = ({ detailPokemon, allPokemonDetails, toggleModal }) => {
  const modalBackground = useRef();
  const [pokemonDetails, setPokemonDetails] = useState(detailPokemon);
  const [speciesInfo, setSpeciesInfo] = useState();
  const [evolutionInfo, setEvolutionInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [shiny, setShiny] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const getSpeciesInfo = async () => {
      const speciesData = await getPokemonDetails(pokemonDetails.species.url);
      setSpeciesInfo(speciesData);

      const evolutionData = await getPokemonEvolutions(
        speciesData.evolution_chain.url
      );

      setEvolutionInfo(evolutionData);

      setLoading(false);
    };

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

  const typeColorGradient = getTypeColorGradient(pokemonDetails.types);

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
        <SpriteInfo
          pokemonDetails={pokemonDetails}
          shiny={shiny}
          loading={loading}
          speciesInfo={speciesInfo}
        />
        <div className="info-box-right">
          <Abilities
            loading={loading}
            pokemonDetails={pokemonDetails}
            speciesInfo={speciesInfo}
          />

          <BaseStats pokemonDetails={pokemonDetails} />

          <EvolutionTree
            loading={loading}
            evolutionInfo={evolutionInfo}
            allPokemonDetails={allPokemonDetails}
            active={active}
            mobile={mobile}
            setPokemonDetails={setPokemonDetails}
            setActive={setActive}
          />
        </div>
        <button className="modal-close" onClick={toggleModal}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default DetailModal;

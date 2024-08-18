import React, { useState, useEffect, useRef } from "react";
import { getPokemonDetails, getPokemonEvolutions } from "./Api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { getTypeColorGradient } from "./Pokemon";
import "react-lazy-load-image-component/src/effects/blur.css";
// import pokeballIcon from "../assets/img/pokeball-icon.png";
// import loadingIcon from "../assets/img/pikachu-running.gif";
import SpriteInfo from "./SpriteInfo";
import Abilities from "./Abilities";
import BaseStats from "./BaseStats";
import EvolutionTree from "./EvolutionTree";
import Moves from "./Moves";
import Strategy from "./Strategy";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const DetailModal = ({ detailPokemon, allPokemonDetails, toggleModal }) => {
  const modalBackground = useRef();
  const [pokemonDetails, setPokemonDetails] = useState(detailPokemon);
  const [speciesInfo, setSpeciesInfo] = useState();
  const [evolutionInfo, setEvolutionInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [shiny, setShiny] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState(0);

  console.log("pokemonDetails", pokemonDetails);

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

  useEffect(() => {
    const index = allPokemonDetails.findIndex(p => p.id === detailPokemon.id);
    setCurrentPokemonIndex(index);
  }, [detailPokemon, allPokemonDetails]);

  const handlePrevPokemon = () => {
    if (currentPokemonIndex > 0) {
      setPokemonDetails(allPokemonDetails[currentPokemonIndex - 1]);
      setCurrentPokemonIndex(currentPokemonIndex - 1);
    }
  };

  const handleNextPokemon = () => {
    if (currentPokemonIndex < allPokemonDetails.length - 1) {
      setPokemonDetails(allPokemonDetails[currentPokemonIndex + 1]);
      setCurrentPokemonIndex(currentPokemonIndex + 1);
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
        <Tabs className="flex flex-col items-center mx-auto">
          <TabList className="flex flex-row mb-5 w-full justify-between items-center">
            {pokemonDetails.id > 1 && (
              <button onClick={() => handlePrevPokemon()} className="arrow-btn left-arrow">
                <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
              </button>
            )}
            <div className="flex">
              <Tab
                id="tab1"
                onClick={() => setActiveTab("tab1")}
                className={`py-2 px-4 rounded-t-md border-2 border-b-0 border-r-0 mx-0 ${
                  activeTab === "tab1" ? "active-tab border-l-0" : "tab"
                }`}
              >
                General
              </Tab>
              <Tab
                id="tab2"
                onClick={() => setActiveTab("tab2")}
                className={`py-2 px-4 rounded-t-md border-2 border-b-0  mx-0 ${
                  activeTab === "tab2" ? "active-tab" : "tab"
                }`}
              >
                Moves
              </Tab>
              <Tab
                id="tab3"
                onClick={() => setActiveTab("tab3")}
                className={`py-2 px-4 rounded-t-md border-2 border-b-0 border-l-0 mx-0 ${
                  activeTab === "tab3" ? "active-tab border-r-0" : "tab"
                }`}
              >
                Strategy
              </Tab>
            </div>
            {pokemonDetails.id < 1025 && (
              <button onClick={() => handleNextPokemon()} className="arrow-btn right-arrow">
                <FontAwesomeIcon icon={faArrowRight} className="icon-size" />
              </button>
            )}
          </TabList>

          <TabPanel className={mobile ? "" : "flex"}>
            <SpriteInfo
              pokemonDetails={pokemonDetails}
              shiny={shiny}
              setShiny={setShiny}
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
            {/* <h2>Any content 2</h2> */}
          </TabPanel>
          <TabPanel>
            <Moves
              moves={pokemonDetails.moves}
              pokemonDetails={pokemonDetails}
            />
          </TabPanel>
          <TabPanel>
            <Strategy pokemonDetails={pokemonDetails} />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default DetailModal;

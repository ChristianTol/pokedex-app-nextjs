import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { capitalizeFirstLetter } from '../helper/helper';
import Image from 'next/image';
import { formatPokemonName } from './Api';
import { TYPE_COLORS } from '../constants/constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Strategy = ({ pokemonDetails, setShiny, shiny, loading, speciesInfo, }) => {
  const [typeRelations, setTypeRelations] = useState(null);
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const pokeIndex = ("000" + pokemonDetails.id).slice(pokemonDetails.id > 999 ? -4 : -3);

  useEffect(() => {
    const fetchTypeRelations = async () => {
      try {
        const typePromises = pokemonDetails.types.map(type => 
          axios.get(`https://pokeapi.co/api/v2/type/${type.type.name}`)
        );
        const typeResponses = await Promise.all(typePromises);

        console.log("typeResponses", typeResponses);
        
        const relations = {
          double_damage_from: new Set(),
          half_damage_from: new Set(),
          no_damage_from: new Set(),
          double_damage_to: new Set(),
          half_damage_to: new Set(),
          no_damage_to: new Set(),
        };

        const damageCounter = {
          damage_from: {},
          damage_to: {},
        };

        typeResponses.forEach(response => {
          const data = response.data.damage_relations;
        
          // Process damage_to
          data.double_damage_to.forEach(type => {
            relations.double_damage_to.add(type.name);
            relations.half_damage_to.delete(type.name);  // Remove from half if present
            relations.no_damage_to.delete(type.name);    // Remove from no damage if present
          });
        
          data.half_damage_to.forEach(type => {
            if (!relations.double_damage_to.has(type.name) && !relations.no_damage_to.has(type.name)) {
              relations.half_damage_to.add(type.name);
            }
          });
        
          data.no_damage_to.forEach(type => {
            if (!relations.double_damage_to.has(type.name)) {
              relations.no_damage_to.add(type.name);
              relations.half_damage_to.delete(type.name);  // Remove from half if present
            }
          });
        
          // Process damage_from
          data.double_damage_from.forEach(type => {
            if (!relations.half_damage_from.has(type.name) && !relations.no_damage_from.has(type.name)) {
              relations.double_damage_from.add(type.name);
            }
          });
        
          data.half_damage_from.forEach(type => {
            if (!relations.no_damage_from.has(type.name)) {
              relations.half_damage_from.add(type.name);
              relations.double_damage_from.delete(type.name);  // Remove from double if present
            }
          });
        
          data.no_damage_from.forEach(type => {
            relations.no_damage_from.add(type.name);
            relations.half_damage_from.delete(type.name);  // Remove from half if present
            relations.double_damage_from.delete(type.name);  // Remove from double if present
          });
        });

        setTypeRelations(relations);
      } catch (error) {
        console.error("Error fetching type relations:", error);
      }
    };

    fetchTypeRelations();
  }, [pokemonDetails]);

  const PokemonDisplay = ({ pokemonDetails }) => (
    <div className="mb-6 text-white text-center shadow-md w-[350px] md:w-[400px] mx-auto" style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '1rem', padding: '15px' }}>
      {/* <h4 className="font-bold" style={{fontSize: '1.7rem'}}>
        {"No. " + pokeIndex}
      </h4> */}
      {/* <img
            className="pokeball-icon"
            src={pokeballIcon}
            alt="pokeball icon"
          /> */}
      <h3 className="tracking-wider" style={{fontSize: '1.9rem', fontWeight: '500'}}>
        {formatPokemonName(pokemonDetails?.species?.name)}
      </h3>
      <div className="" onClick={() => setShiny(!shiny)}>
        <LazyLoadImage
          className="mx-auto"
          src={
            shiny
              ? pokemonDetails.sprites.other["official-artwork"].front_shiny
              : pokemonDetails.sprites.other["official-artwork"].front_default
          }
          alt={pokemonDetails.name}
          effect="blur"
          style={{width: '170px', height: '170px'}}
        />
      </div>
      {/* {loading
        ? "Loading..."
        : <p style={{fontWeight: '500'}}>{speciesInfo?.genera?.[
            pokemonDetails.id >= 899 && pokemonDetails.id <= 905
              ? 5
              : pokemonDetails.id >= 906 && pokemonDetails.id <= 1025
              ? 3
              : 7
          ]?.genus}</p>} */}
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
    </div>
  );

  
  const renderTypeList = (types, label) => {
    if (types.size === 0) return null;
    
    const sortedTypes = Array.from(types).sort();
  
    return (
      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-lg">{label}</h4>
        <div className="flex flex-wrap gap-3">
          {sortedTypes.map(type => (
            <span 
              key={type} 
              className={`type-icon ${type} rounded-full p-2 flex items-center justify-center`}
              style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: `${type}`,
                boxShadow: `0 0 8px ${TYPE_COLORS[type]}`,
              }}
            >
              <Image
                src={`/icons/${type}.svg`}
                alt={type}
                width={32}
                height={32}
                className="rounded-full"
              />
            </span>
          ))}
        </div>
      </div>
    );
  };
  

  if (!typeRelations) {
    return <div>Loading type relations...</div>;
  }

  return (
    <div className="strategy-container ">
      <PokemonDisplay pokemonDetails={pokemonDetails} />
      
      <div className="type-effectiveness grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <div className="mb-2 text-white p-4 shadow-md w-[350px] md:w-[500px] mx-auto" style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '1rem' }}>
          <h3 className="text-xl font-bold mb-4">Offensive</h3>
          {renderTypeList(typeRelations.double_damage_to, "Super effective")}
          {renderTypeList(typeRelations.half_damage_to, "Not very effective")}
          {renderTypeList(typeRelations.no_damage_to, "No effect")}
        </div>
        <div className="mb-2 text-white p-4 shadow-md w-[350px] md:w-[500px] mx-auto" style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '1rem' }}>
          <h3 className="text-xl font-bold mb-4">Defensive</h3>
          {renderTypeList(typeRelations.double_damage_from, "Vulnerable")}
          {renderTypeList(typeRelations.half_damage_from, "Resistant")}
          {renderTypeList(typeRelations.no_damage_from, "Immune")}
        </div>
      </div>
    </div>
  );
};

export default Strategy;
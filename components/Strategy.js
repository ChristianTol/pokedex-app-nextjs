import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { capitalizeFirstLetter } from '../helper/helper';
import Image from 'next/image';

const Strategy = ({ pokemonDetails }) => {
  const [typeRelations, setTypeRelations] = useState(null);
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  useEffect(() => {
    const fetchTypeRelations = async () => {
      try {
        const typePromises = pokemonDetails.types.map(type => 
          axios.get(`https://pokeapi.co/api/v2/type/${type.type.name}`)
        );
        const typeResponses = await Promise.all(typePromises);
        
        const relations = {
          quadruple_damage_from: new Set(),
          double_damage_from: new Set(),
          half_damage_from: new Set(),
          quarter_damage_from: new Set(),
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
          Object.keys(relations).forEach(key => {
            if (key !== 'quadruple_damage_from' && key !== 'quarter_damage_from') {
              data[key].forEach(type => {
                const category = key.includes('_from') ? 'damage_from' : 'damage_to';
                const typeName = type.name;
                damageCounter[category][typeName] = (damageCounter[category][typeName] || 0) + 1;
              });
            }
          });
        });

        // Process damage counters
        Object.entries(damageCounter.damage_from).forEach(([type, count]) => {
          if (count === 2) relations.quadruple_damage_from.add(type);
          else if (count === 1) relations.double_damage_from.add(type);
        });

        Object.entries(damageCounter.damage_to).forEach(([type, count]) => {
          if (count === 2) relations.double_damage_to.add(type);
          else if (count === 1) relations.double_damage_to.add(type);
        });

        // Process resistances and immunities
        typeResponses.forEach(response => {
          const data = response.data.damage_relations;
          data.half_damage_from.forEach(type => {
            if (relations.double_damage_from.has(type.name)) {
              relations.double_damage_from.delete(type.name);
            } else if (relations.half_damage_from.has(type.name)) {
              relations.half_damage_from.delete(type.name);
              relations.quarter_damage_from.add(type.name);
            } else {
              relations.half_damage_from.add(type.name);
            }
          });

          data.no_damage_from.forEach(type => {
            relations.quadruple_damage_from.delete(type.name);
            relations.double_damage_from.delete(type.name);
            relations.half_damage_from.delete(type.name);
            relations.quarter_damage_from.delete(type.name);
            relations.no_damage_from.add(type.name);
          });
        });

        setTypeRelations(relations);
      } catch (error) {
        console.error("Error fetching type relations:", error);
      }
    };

    fetchTypeRelations();
  }, [pokemonDetails]);

  
    const renderTypeList = (types, multiplier) => {
        if (types.size === 0) return null;
        
        return (
        <div className="mb-6">
            <h2 style={{fontSize: '18px'}}>{multiplier}x </h2>
            <ul className="flex flex-wrap gap-2">
            {Array.from(types).map(type => (
                <span
                key={type}
                className={`px-2 py-0 md:py-3 rounded flex items-center justify-center sm:px-3 sm:py-1 sm:gap-1
                ${isMobile && type}`}
              >
                <div className="md:hidden">
                  <Image
                    src={`/icons/${type}.svg`}
                    alt={`${type}`}
                    width={15}
                    height={15}
                  />
                </div>
                <div className="hidden md:flex">
                  <div
                    className={`${type} rounded-l m-[-8px] [clip-path:polygon(0%_0%,100%_0%,80%_100%,0%_100%)]`}
                  >
                    <div className="h-[32px] w-[45px] flex items-center justify-center pr-[10px]">
                      <Image
                        className=""
                        src={`/icons/${type}.svg`}
                        alt={`${type}`}
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                  <div
                    className={`h-[32px] w-[90px] flex items-center justify-center m-[-8px] rounded-r ${type}-text font-bold [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)]`}
                  >
                    <h6 className="hidden md:inline uppercase px-[8px]">
                        {capitalizeFirstLetter(type)}
                    </h6>
                  </div>
                </div>
              </span>
            ))}
            </ul>
        </div>
        );
    };

    if (!typeRelations) {
        return <div>Loading type relations...</div>;
    }

    const renderSection = (title, items) => {
        const nonEmptySections = items.filter(item => item.types.size > 0);
        if (nonEmptySections.length === 0) return null;

        return (
        <div className="mb-6 text-white rounded-lg p-4 shadow-md" style={{ background: 'rgba(0, 0, 0, 0.3)'}}>
            <h3 className="text-xl font-semibold mb-3" style={{fontSize: '20px'}}>{title}</h3>
            {items.map(item => renderTypeList(item.types, item.multiplier))}
        </div>
        );
    };

    return (
        <div className="strategy-container">
            <h2 className="text-2xl font-bold mb-6 text-center">Type Effectiveness</h2>
            
            <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2 pr-0 md:pr-2" style={{maxWidth: '500px'}}>
                {renderSection("Super Effective Against", [
                { types: typeRelations.quadruple_damage_from, multiplier: 4 },
                { types: typeRelations.double_damage_to, multiplier: 2 }
                ])}
                {renderSection("Not Very Effective Against", [
                { types: typeRelations.half_damage_to, multiplier: 0.5 },
                { types: typeRelations.quarter_damage_from, multiplier: 0.25 }
                ])}
                {renderSection("No Effect Against", [
                { types: typeRelations.no_damage_to, multiplier: 0 }
                ])}
            </div>

            <div className="w-full md:w-1/2 pl-0 md:pl-2 mt-4 md:mt-0" style={{maxWidth: '500px'}}>
                {renderSection("Weaknesses", [
                { types: typeRelations.quadruple_damage_from, multiplier: 4 },
                { types: typeRelations.double_damage_from, multiplier: 2 }
                ])}
                {renderSection("Resistances", [
                { types: typeRelations.half_damage_from, multiplier: 0.5 },
                { types: typeRelations.quarter_damage_from, multiplier: 0.25 }
                ])}
                {renderSection("Immunities", [
                { types: typeRelations.no_damage_from, multiplier: 0 }
                ])}
            </div>
            </div>
        </div>
    );
};

export default Strategy;
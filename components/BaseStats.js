import React from "react";
import { formatStatName } from "./Api";
import { STAT_COLORS } from "../constants/constants";

const BaseStats = ({ pokemonDetails }) => {
  return (
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
                  <span className="text-black font-bold">{stat.base_stat}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BaseStats;

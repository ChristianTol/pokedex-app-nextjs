import React, { useState, useEffect, useRef } from "react";
import { Loader } from "./Loader";
import { getTypeColorGradient } from "./Pokemon";
import { TYPE_COLORS, TYPE_SECONDARY_COLORS } from "../constants/constants";
import { capitalizeFirstLetter, cleanWords } from "../helper/helper";
import Image from "next/image";

const MoveDetailModal = ({
  toggleModal,
  moveData,
  baseColor,
  pokemonDetails,
}) => {
  const modalBackground = useRef();

  const handleBackgroundClick = (e) => {
    if (e.target === modalBackground.current) {
      toggleModal();
    }
  };

  return (
    <div
      ref={modalBackground}
      className="modal-background"
      onClick={handleBackgroundClick}
    >
      <div className={`move-modal-container flex justify-center items-center`}>
        {moveData ? (
          <div className="w-[500px] text-center">
            <div className="flex justify-center items-center mb-5">
              <div>
                <img
                  className="mr-1 mt-1"
                  src={`/icons/TM/${moveData.data.type.name.toLowerCase()}-tm.png`}
                  height={45}
                  width={45}
                  alt="tm-icon"
                />
              </div>
              <h1
                className={`text-4xl  font-bold text-white ${baseColor}-color`}
              >
                {cleanWords(moveData.data.name)}
              </h1>
            </div>
            <div className="hidden md:flex justify-center">
              <div
                className={`${moveData.data.type.name} rounded-l m-[-8px] [clip-path:polygon(0%_0%,100%_0%,80%_100%,0%_100%)]`}
              >
                <div className="h-[32px] w-[45px] flex items-center justify-center pr-[10px]">
                  <Image
                    className=""
                    src={`/icons/${moveData.data.type.name}.svg`}
                    alt={`${moveData.data.type.name}`}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div
                className={`h-[32px] w-[90px] flex items-center justify-center m-[-8px] rounded-r ${moveData.data.type.name.toLowerCase()}-text font-bold [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)]`}
              >
                <p className="hidden md:inline uppercase px-[8px]">
                  {capitalizeFirstLetter(moveData.data.type.name)}
                </p>
              </div>
            </div>
            <div className="flex justify-between w-full mt-12 text-white">
              <div className="text-center">
                <h3 className="mb-2 font-bold">Power</h3>
                <h4>{moveData.data.power ? moveData.data.power : "-"}</h4>
              </div>
              <div className="text-center">
                <h3 className="mb-2 font-bold">Accuracy</h3>
                <h4>{moveData.data.accuracy ? moveData.data.accuracy : "-"}</h4>
              </div>
              <div className="text-center">
                <h3 className="mb-2 font-bold">PP</h3>
                <h4>{moveData.data.pp ? moveData.data.pp : "-"}</h4>
              </div>
              <div className="text-center">
                <h3 className="mb-2 font-bold">Category</h3>
                <img
                  style={{ marginLeft: "11px" }}
                  src={`icons/${moveData.data.damage_class.name}1.png`}
                  height={45}
                  width={45}
                  alt="type-icon"
                />
              </div>
            </div>
            <div className="my-6">
              <p className="text-white">{moveData.fte[0].flavor_text}</p>
            </div>
            <button className="modal-close" onClick={toggleModal}>
              &times;
            </button>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default MoveDetailModal;

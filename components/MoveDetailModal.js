import React, { useState, useEffect, useRef } from "react";
import { Loader } from "./Loader";
import { getTypeColorGradient } from "./Pokemon";
import { TYPE_COLORS, TYPE_SECONDARY_COLORS } from "../constants/constants";
import { capitalizeFirstLetter, cleanWords } from "../helper/helper";

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
            <div
              className={`py-2 max-w-[120px] m-auto rounded-md flex justify-center items-center overflow-hidden ${moveData.data.type.name.toLowerCase()}`}
            >
              <img
                src={`/icons/${moveData.data.type.name.toLowerCase()}.svg`}
                height={20}
                width={20}
                alt="type-icon"
              />
              <p className="text-[1.2rem] pl-1">
                {capitalizeFirstLetter(moveData.data.type.name)}
              </p>
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

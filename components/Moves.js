import { allMoves } from "../constants/allMoves";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import Loader from "./Loader";
import MoveDetailModal from "./MoveDetailModal";

const Moves = ({ moves, baseColor, pokemonDetails }) => {
  const [selectedGame, setGame] = useState("scarlet-violet");
  const [learnMethod, setMethod] = useState("level-up");
  const [moveData, setMoveData] = useState(null);
  const [showMoveDetailModal, setShowMoveDetailModal] = useState(false);
  const [moveList, setMoveList] = useState([]);
  const [isLevel, setIsLevel] = useState(true);
  const [isPower, setIsPower] = useState(false);
  const [isMove, setIsMove] = useState(false);
  const [isType, setIsType] = useState(false);
  const [sortBy, setSortBy] = useState("level");

  console.log(moves);

  useEffect(() => {
    const filteredMoves = moves.filter((move) => {
      const game = move.version_group_details.filter(
        (game) => game.version_group.name === selectedGame
      );
      const method = game.filter(
        (method) => method.move_learn_method.name === learnMethod
      );
      if (method.length > 0) {
        return true;
      }
      return false;
    });
    setMoveList(filteredMoves);

    return () => {
      setMoveList([]);
    };
  }, [moves, selectedGame, learnMethod]);

  let gameList = [
    "red-blue",
    "yellow",
    "gold-silver",
    "crystal",
    "ruby-sapphire",
    "emerald",
    "firered-leafgreen",
    "diamond-pearl",
    "platinum",
    "heartgold-soulsilver",
    "black-white",
    "black-2-white-2",
    "x-y",
    "omega-ruby-alpha-sapphire",
    "sun-moon",
    "ultra-sun-ultra-moon",
    "sword-shield",
    "scarlet-violet",
  ];

  const bringMovesData = (e, moveURL) => {
    setShowMoveDetailModal(true);
    axios
      .get(moveURL)
      .then((res) => {
        const englishFTE = res.data.flavor_text_entries.filter(
          (ft) =>
            ft.language.name === "en" &&
            ft.version_group.name === "sword-shield"
        );
        setMoveData({ data: res.data, fte: englishFTE });
      })
      .catch((e) => console.log(e));
  };

  const toggleModal = (pokemonDetails) => {
    // if (pokemonDetails) {
    //   setDetailPokemon(pokemonDetails);
    // } else {
    //   setDetailPokemon({});
    // }
    setShowMoveDetailModal((value) => !value);

    if (!showMoveDetailModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleSort = (value) => {
    switch (value) {
      case "level":
        if (sortBy === "level") {
          setIsLevel((prev) => !prev);
        } else {
          setSortBy("level");
          setIsLevel(true);
          setIsMove(false);
          setIsType(false);
          setIsPower(false);
        }
        break;
      case "power":
        if (sortBy === "power") {
          setIsPower((prev) => !prev);
        } else {
          setSortBy("power");
          setIsPower(true);
          setIsLevel(false);
          setIsMove(false);
          setIsType(false);
        }
        break;
      case "move":
        if (sortBy === "move") {
          setIsMove((prev) => !prev);
        } else {
          setSortBy("move");
          setIsMove(true);
          setIsLevel(false);
          setIsType(false);
          setIsPower(false);
        }
        break;
      case "type":
        if (sortBy === "type") {
          setIsType((prev) => !prev);
        } else {
          setSortBy("type");
          setIsType(true);
          setIsMove(false);
          setIsLevel(false);
          setIsPower(false);
        }
        break;
      default:
        break;
    }
  };

  const finalMoves = moves
    .map((singleMoveFromAPI) => {
      const moveStatsFromBigFat = allMoves.filter(
        (bigFatMove) =>
          bigFatMove.ename.toLowerCase().replaceAll("-", " ") ===
          singleMoveFromAPI.move.name.replaceAll("-", " ")
      );

      const moveURL = singleMoveFromAPI.move.url;

      const gamesWithThisMove = [];
      const gamesInWhichItsPresent_learnMethod_levelLearned = [];
      singleMoveFromAPI.version_group_details.forEach((gameDetails) => {
        gamesWithThisMove.push(gameDetails.version_group.name);
        const obj = {
          game_name: gameDetails.version_group.name,
          learn_method: gameDetails.move_learn_method.name,
          level_learned_at: gameDetails.level_learned_at,
        };
        gamesInWhichItsPresent_learnMethod_levelLearned.push(obj);
      });

      gamesInWhichItsPresent_learnMethod_levelLearned.sort((a, b) => {
        a.level_learned_at - b.level_learned_at;
      });

      const methodAndLevel =
        gamesInWhichItsPresent_learnMethod_levelLearned.filter(
          (x) => x.game_name === selectedGame
        );

      const ml = moveStatsFromBigFat.length;
      const name =
        ml && moveStatsFromBigFat[0].ename
          ? moveStatsFromBigFat[0].ename
          : null;
      const category =
        ml && moveStatsFromBigFat[0].category
          ? moveStatsFromBigFat[0].category
          : null;
      const power =
        ml && moveStatsFromBigFat[0].power ? moveStatsFromBigFat[0].power : "-";
      const accuracy =
        ml && moveStatsFromBigFat[0].accuracy
          ? moveStatsFromBigFat[0].accuracy
          : "-";
      const pp =
        ml && moveStatsFromBigFat[0].pp ? moveStatsFromBigFat[0].pp : "-";
      const type =
        ml && moveStatsFromBigFat[0].type
          ? moveStatsFromBigFat[0].type
          : "normal";

      if (
        gamesWithThisMove.includes(selectedGame) &&
        methodAndLevel[0].learn_method === learnMethod &&
        name
      ) {
        console.log(category);
        return {
          name: name,
          category: category,
          level: methodAndLevel[0].level_learned_at,
          power: power,
          pp: pp,
          accuracy: accuracy,
          type: type,
          url: moveURL,
        };
      } else {
        return null;
      }
    })
    .filter((move) => move !== null);

  let sortedMoves = [...finalMoves];

  switch (sortBy) {
    case "level":
      sortedMoves = isLevel
        ? sortedMoves.sort((a, b) => a.level - b.level)
        : sortedMoves.sort((a, b) => b.level - a.level);
      break;
    case "power":
      sortedMoves = isPower
        ? sortedMoves.sort((a, b) => {
            if (a.power === "-" && b.power === "-") {
              return 0;
            } else if (a.power === "-") {
              return 1;
            } else if (b.power === "-") {
              return -1;
            } else {
              return a.power - b.power;
            }
          })
        : sortedMoves.sort((a, b) => {
            if (a.power === "-" && b.power === "-") {
              return 0;
            } else if (a.power === "-") {
              return 1;
            } else if (b.power === "-") {
              return -1;
            } else {
              return b.power - a.power;
            }
          });
      break;
    case "move":
      sortedMoves = isMove
        ? sortedMoves.sort((a, b) => a.name.localeCompare(b.name))
        : sortedMoves.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "type":
      sortedMoves = isType
        ? sortedMoves.sort((a, b) => a.type.localeCompare(b.type))
        : sortedMoves.sort((a, b) => b.type.localeCompare(a.type));
      break;
    default:
      break;
  }

  const movesToRender = sortedMoves.map((move) => {
    return (
      <div
        className="flex w-[900px] justify-between text-xs lg:text-sm text-white py-2 cursor-pointer hover:bg-slate-900 rounded-md p-3 transition-colors duration-400 items-center"
        key={move.name}
        onClick={(e) => bringMovesData(e, move.url)}
      >
        {learnMethod === "level-up" ? (
          <div className="w-1/12 text-[1.1rem]">{move.level}</div>
        ) : null}
        <div className="w-2/12 text-[1.1rem] flex row items-center">
          <img
            className="mr-0 mt-1"
            src={`/icons/TM/${move.type.toLowerCase()}-tm.png`}
            height={30}
            width={30}
            alt="type-icon"
          />
          {move.name}
        </div>
        <div
          className={`py-2 rounded-md flex w-2/12 justify-center items-center overflow-hidden ${move.type.toLowerCase()}`}
        >
          <img
            src={`/icons/${move.type.toLowerCase()}.svg`}
            height={20}
            width={20}
            alt="type-icon"
          />
          <p className="text-[1.1rem] pl-1">{move.type}</p>
        </div>
        <div className="w-1/12 text-[1.1rem]">{move.power}</div>
        {/* <div className="w-1/12 text-[1.1rem]">{move.pp}</div> */}
        <div className="w-1/12 text-[1.1rem]">{move.accuracy}</div>
        <div
          className={`py-2 rounded-md flex w-1/12 justify-center items-center overflow-hidden`}
        >
          <img
            src={`icons/${move.category}.png`}
            height={45}
            width={45}
            alt="type-icon"
          />
        </div>
        {/* <div className="w-1/12">
          <div
            className={`icon ${move.type.toLowerCase()} w-[50px] p-2 rounded-md flex`}
          >
            <img src={`/icons/${move.type.toLowerCase()}.svg`} alt="type-icon" />
          </div>
        </div> */}
      </div>
    );
  });

  // const Modal = () => {
  //   const close = () => {
  //     setModal(false);
  //     setMoveData(null);
  //   };

  //   return (
  //     <Dialog
  //       isOpen={modal}
  //       onDismiss={close}
  //       aria-label="Pokemon Move Information"
  //     >
  //       <div className="w-full leading-relaxed text-center md:py-8 md:px-12 rounded">
  //         {moveData ? (
  //           <div className="w-full h-full text-center capitalize flex-1">
  //             <h1 className={`text-4xl text-white ${baseColor}-color`}>
  //               {moveData.data.name}
  //             </h1>
  //             <h2 className="text-white mt-1">
  //               {moveData.data.type.name} type move
  //             </h2>
  //             <div className="flex justify-between w-full mt-12 text-white">
  //               <div className="text-center">
  //                 <h3>Accuracy</h3>
  //                 <h4>
  //                   {moveData.data.accuracy ? moveData.data.accuracy : "-"}
  //                 </h4>
  //               </div>
  //               <div className="text-center">
  //                 <h3>Power</h3>
  //                 <h4>{moveData.data.power ? moveData.data.power : "-"}</h4>
  //               </div>
  //               <div className="text-center">
  //                 <h3>PP</h3>
  //                 <h4>{moveData.data.pp ? moveData.data.pp : "-"}</h4>
  //               </div>
  //               <div className="text-center">
  //                 <h3>Priority</h3>
  //                 <h4>
  //                   {moveData.data.priority ? moveData.data.priority : "-"}
  //                 </h4>
  //               </div>
  //             </div>
  //             <div className="my-6">
  //               <p className="text-white">{moveData.fte[0].flavor_text}</p>
  //             </div>
  //             <span
  //               className="bg-red-500 rounded px-3 py-2 text-white hover:bg-red-600 cursor-pointer"
  //               onClick={close}
  //             >
  //               Close
  //             </span>
  //           </div>
  //         ) : (
  //           <Loader />
  //         )}
  //       </div>
  //     </Dialog>
  //   );
  // };

  return (
    <div className="move-list rounded-md pb-2 hidden sm:block">
      {showMoveDetailModal && (
        <MoveDetailModal
          moveData={moveData}
          pokemonDetails={pokemonDetails}
          baseColor={baseColor}
          toggleModal={toggleModal}
        />
      )}

      <div className="flex items-center mb-3 text-white w-full mt-8">
        <div className="flex justify-end grow-[6]">
          <div
            className={`mx-4 rounded-full px-2 py-1 cursor-pointer text-white hover:shadow-2xl transition-shadow duration-500 text-md tracking-wide ${baseColor} ${
              learnMethod === "level-up" ? "selected" : null
            }`}
            onClick={() => setMethod("level-up")}
          >
            Level Up
          </div>
          <div
            className={`mx-4 rounded-full px-2 py-1 cursor-pointer text-white hover:shadow-2xl transition-shadow duration-500 text-md tracking-wide ${baseColor} ${
              learnMethod === "tutor" ? "selected" : null
            }`}
            onClick={() => setMethod("tutor")}
          >
            Tutor
          </div>
          <div
            className={`mx-4 rounded-full px-2 py-1 cursor-pointer text-gray-100 hover:shadow-2xl transition-shadow duration-500 text-md tracking-wide ${baseColor} ${
              learnMethod === "machine" ? "selected" : null
            }`}
            onClick={() => setMethod("machine")}
          >
            TM&apos;s
          </div>
        </div>
        <div className="flex justify-center grow-[2]">
          <select
            name="game-selection"
            className="game-dropdown"
            value={selectedGame}
            onChange={(e) => setGame(e.target.value)}
          >
            {gameList.map((x) => {
              let formattedOption = x;
              if (x.includes("-")) {
                const words = x.split("-");
                if (words.length === 2) {
                  formattedOption =
                    words[0].charAt(0).toUpperCase() +
                    words[0].slice(1) +
                    " & " +
                    words[1].charAt(0).toUpperCase() +
                    words[1].slice(1);
                } else {
                  formattedOption = words
                    .map((word, index) => {
                      if (index === 1) {
                        return (
                          word.charAt(0).toUpperCase() + word.slice(1) + " &"
                        );
                      }
                      return word.charAt(0).toUpperCase() + word.slice(1);
                    })
                    .join(" ");
                }
              } else {
                formattedOption = x.charAt(0).toUpperCase() + x.slice(1);
              }
              return (
                <option
                  key={x}
                  value={x}
                  className="capitalize bg-slate-900 text-xs"
                >
                  {formattedOption}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="divTable lg:px-16 my-10">
        <div className="body flex flex-col">
          <div
            className={`row flex justify-between w-full border-b-2 shadow-2xl pr-4 font-bold ${baseColor}-color text-sm lg:text-lg`}
          >
            {learnMethod === "level-up" ? (
              <div
                className="w-1/12 cursor-pointer"
                onClick={() => handleSort("level")}
              >
                Lvl.
              </div>
            ) : null}

            <div
              className="w-2/12 lg:pl-4 cursor-pointer"
              onClick={() => handleSort("move")}
            >
              Move
            </div>
            <div
              className="w-2/12 lg:pl-4 cursor-pointer"
              onClick={() => handleSort("type")}
            >
              Type
            </div>
            <div
              className="w-2/12 lg:pl-4 cursor-pointer"
              onClick={() => handleSort("power")}
            >
              Power
            </div>
            {/* <div className="w-1/12">PP</div> */}
            <div className="w-1/12">Accuracy</div>
            <div className="w-1/12">Category</div>
          </div>
          <div className="overflow-y-scroll overflow-x-hidden py-3 bg-transparent border-b border-gray-300">
            {movesToRender}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moves;

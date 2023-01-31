import axios from "axios";

const getPokemonList = async (url) => {
  const response = await axios.get(url);

  response.data.results = response.data.results.map((pokemon) => {
    return { id: getPokemonIdFromUrl(pokemon.url), ...pokemon };
  });

  return response.data.results;
};

const getPokemonDetails = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const getPokemonIdFromUrl = (url) => {
  const urlSegments = url.split("/");
  // Handle trailing backslash
  const pokemonId = urlSegments.pop() || urlSegments.pop();
  return pokemonId;
};

// Returns a 2D array where each entry is an array of
// the IDs of the Pokemon corresponding to that stage of evolution
// Maximum of 3 stages so the outer array has at most 3 entries
const getPokemonEvolutions = async (url) => {
  const evolutions = [];
  const response = await axios.get(url);
  let evoData = response.data.chain;

  // do {
  //   let numberOfEvolutions = evoData.evolves_to.length;
  //   let evoDetails = evoData.evolution_details[0];

  //   evolutions.push([
  //     {
  //       id: getPokemonIdFromUrl(evoData.species.url),
  //       species_name: evoData.species.name,
  //       min_level: !evoDetails ? 1 : evoDetails.min_level,
  //       trigger_name: !evoDetails ? null : evoDetails.trigger.name,
  //       item: !evoDetails ? null : evoDetails.item,
  //       min_happiness: !evoDetails ? null : evoDetails.min_happiness,
  //       time_of_day: !evoDetails ? null : evoDetails.time_of_day,
  //       known_move: !evoDetails ? null : evoDetails.known_move,
  //       known_move_type: !evoDetails ? null : evoDetails.known_move_type,
  //     },
  //   ]);

  //   if (numberOfEvolutions > 1) {
  //     for (let i = 1; i < numberOfEvolutions; i++) {
  //       evoDetails =
  //         evoData.evolves_to[i].species.name === "glaceon" ||
  //         evoData.evolves_to[i].species.name === "leafeon"
  //           ? evoData.evolves_to[i].evolution_details[4]
  //           : evoData.evolves_to[i].evolution_details[0];
  //       evolutions.push([
  //         {
  //           id: getPokemonIdFromUrl(evoData.evolves_to[i].species.url),
  //           species_name: evoData.evolves_to[i].species.name,
  //           min_level: !evoDetails ? 1 : evoDetails.min_level,
  //           trigger_name: !evoDetails ? null : evoDetails.trigger.name,
  //           item: !evoDetails ? null : evoDetails.item,
  //           min_happiness: !evoDetails ? null : evoDetails.min_happiness,
  //           time_of_day: !evoDetails ? null : evoDetails.time_of_day,
  //           known_move: !evoDetails ? null : evoDetails.known_move,
  //           known_move_type: !evoDetails ? null : evoDetails.known_move_type,
  //         },
  //       ]);
  //     }
  //   }

  //   evoData = evoData.evolves_to[0];
  // } while (evoData != undefined && evoData.hasOwnProperty("evolves_to"));

  const traverseEvolutionTree = (node, level) => {
    // let numberOfEvolutions = node.evolves_to.length;
    let evoDetails = node.evolution_details[0];

    evoDetails =
      node.species.name === "glaceon" || node.species.name === "leafeon"
        ? node.evolution_details[4]
        : node.evolution_details[0];
    if (evolutions[level] === undefined) evolutions[level] = [];
    evolutions[level].push({
      id: getPokemonIdFromUrl(node.species.url),
      species_name: node.species.name,
      min_level: !evoDetails ? 1 : evoDetails.min_level,
      trigger_name: !evoDetails ? null : evoDetails.trigger.name,
      item: !evoDetails ? null : evoDetails.item,
      min_happiness: !evoDetails ? null : evoDetails.min_happiness,
      time_of_day: !evoDetails ? null : evoDetails.time_of_day,
      known_move: !evoDetails ? null : evoDetails.known_move,
      known_move_type: !evoDetails ? null : evoDetails.known_move_type,
      held_item: !evoDetails ? null : evoDetails.held_item,
      location: !evoDetails ? null : evoDetails.location,
      needs_overworld_rain: !evoDetails
        ? null
        : evoDetails.needs_overworld_rain,
    });
    node.evolves_to.forEach((child) => traverseEvolutionTree(child, level + 1));
  };

  traverseEvolutionTree(evoData, 0);

  return evolutions;
};

const formatPokemonName = (name) => {
  // Capitalize each word and change gender letters to the apprpriate symbol
  return name
    .toLowerCase()
    .split("-")
    .map((s) => {
      if (s === "m") {
        return "♂";
      } else if (s === "f") {
        return "♀";
      }
      return s.charAt(0).toUpperCase() + s.substring(1);
    })
    .join(" ");
};

const formatStatName = (name) => {
  if (name === "hp") return "HP";

  return name
    .toLowerCase()
    .split("-")
    .map((s) => {
      if (s === "special") return "Sp";
      return s.charAt(0).toUpperCase() + s.substring(1);
    })
    .join(" ");
};

const getJapaneseName = async (id) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`
  );
  return response.data.names[0].name;
};

export {
  getPokemonList,
  getPokemonDetails,
  getPokemonEvolutions,
  getJapaneseName,
  formatPokemonName,
  formatStatName,
};

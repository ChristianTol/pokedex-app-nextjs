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
  const evoData = response.data;

  // Breadth first traversal of the evolution tree
  const traverseEvolutionTree = (node, level) => {
    if (evolutions[level] === undefined) evolutions[level] = [];
    evolutions[level].push(getPokemonIdFromUrl(node.species.url));
    node.evolves_to.forEach((child) => traverseEvolutionTree(child, level + 1));
  };

  traverseEvolutionTree(evoData.chain, 0);

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

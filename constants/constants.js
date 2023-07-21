export const POKEMON_PER_LOAD = 15;

export const REGIONS = [
  "all",
  "kanto",
  "johto",
  "hoenn",
  "sinnoh",
  "unova",
  "kalos",
  "alola",
  "galar",
  "hisui",
  "paldea",
];

export const REGION_INFO = {
  all: {
    start: 0,
    limit: 1010,
  },
  kanto: {
    start: 0,
    limit: 151,
  },
  johto: {
    start: 151,
    limit: 100,
  },
  hoenn: {
    start: 251,
    limit: 135,
  },
  sinnoh: {
    start: 386,
    limit: 107,
  },
  unova: {
    start: 493,
    limit: 156,
  },
  kalos: {
    start: 649,
    limit: 72,
  },
  alola: {
    start: 721,
    limit: 88,
  },
  galar: {
    start: 809,
    limit: 89,
  },
  hisui: {
    start: 898,
    limit: 7,
  },
  paldea: {
    start: 905,
    limit: 105,
  },
};

export const TYPES = [
  "all",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

// export const TYPE_COLORS = {
//   normal: "#a8a77a",
//   fire: "#ee8130",
//   water: "#6390f0",
//   electric: "#f7d02c",
//   grass: "#7ac74c",
//   ice: "#96d9d6",
//   fighting: "#c22e28",
//   poison: "#a33ea1",
//   ground: "#e2bf65",
//   flying: "#a98ff3",
//   psychic: "#f95587",
//   bug: "#a6b91a",
//   rock: "#b6a136",
//   ghost: "#735797",
//   dragon: "#6f35fC",
//   dark: "#705746",
//   steel: "#b7b7ce",
//   fairy: "#d685ad",
// };

export const TYPE_COLORS = {
  normal: "#a8a77a",
  fire: "#ef9f65",
  water: "#6390f0",
  electric: "#f7d02c",
  grass: "#7ac74c",
  ice: "#96d9d6",
  fighting: "#c22e28",
  poison: "#a33ea1",
  ground: "#e2bf65",
  flying: "#a98ff3",
  psychic: "#f95587",
  bug: "#a6b91a",
  rock: "#b6a136",
  ghost: "#735797",
  dragon: "#6f35fC",
  dark: "#705746",
  steel: "#b7b7ce",
  fairy: "#d685ad",
};

// Secondary colors for Pokemon with one type, to make the gradient more appealing
export const TYPE_SECONDARY_COLORS = {
  normal: "#d7d6ab",
  fire: "#d12929",
  water: "#185ceb",
  electric: "#f3a800",
  grass: "#b0e50e",
  ice: "#5dfbe5",
  fighting: "#d11313",
  poison: "#6a3469",
  // ground: "#c3a200",
  ground: "#ff9d54",
  flying: "#b8a7e9",
  psychic: "#ff004e",
  bug: "#7a8b01",
  rock: "#856f00",
  ghost: "#6204db",
  dragon: "#362f46",
  dark: "#221a14",
  steel: "#ebebed",
  fairy: "#f1a2c9",
};

export const SORT_BY = ["Number (Low-High)", "Number (High-Low)", "A-Z", "Z-A"];

export const STAT_COLORS = {
  hp: "#ff0100",
  attack: "#f08030",
  defense: "#f9d02f",
  "special-attack": "#6790f0",
  "special-defense": "#78c84f",
  speed: "#f95887",
};

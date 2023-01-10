import React from "react";
import Layout from "../../components/Layout";
import { capitalizeFirstLetter } from "../../helper/helper";

const Pokemon = ({ pokemon }) => {
  return (
    <Layout>
      <h1>{capitalizeFirstLetter(pokemon.name)}</h1>
    </Layout>
  );
};

export default Pokemon;

export async function getServerSideProps(context) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${context.query.name}`
  );
  const pokemon = await response.json();

  return {
    props: {
      pokemon,
    },
  };
}

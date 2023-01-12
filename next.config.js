/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["assets.pokemon.com", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;

import React, {useState, useEffect} from "react";
import axios from 'axios';
import gmaxIcon from '../public/gmax.png';
import normalIcon from '../public/pokeball-2.png'

const FormSelector = ({speciesInfo, onFormSelect, currentPokemonId, pokemonDetails}) => {
    const [forms, setForms] = useState([]);
    const [formSprites, setFormSprites] = useState({});

    const getPokemonIdFromUrl = (url) => {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 2]);
    };

    useEffect(() => {
        const fetchPokemonSprites = async (url) => {
            try {
                const response = await axios.get(url);
                return response.data.sprites.other["official-artwork"].front_default;
            } catch (error) {
                console.error('Error fetching pokemon sprite:', error);
                return null;
            }
        };

        const loadFormSprites = async () => {
            if (speciesInfo?.varieties && speciesInfo.varieties.length > 1) {
                const spritePromises = speciesInfo.varieties.map(variety =>
                    fetchPokemonSprites(variety.pokemon.url)
                );

                const sprites = await Promise.all(spritePromises);
                const spritesMap = {};

                speciesInfo.varieties.forEach((variety, index) => {
                    spritesMap[variety.pokemon.name] = sprites[index];
                });

                setFormSprites(spritesMap);

                const formsList = speciesInfo.varieties.map(variety => {
                    return {
                        name: variety.pokemon.name,
                        image: variety.pokemon.name,
                        id: getPokemonIdFromUrl(variety.pokemon.url),
                        isDefault: variety.is_default
                    };
                });
                setForms(formsList);
            }
        };

        loadFormSprites();
    }, [speciesInfo]);

    if (forms.length <= 1) return null;

    return (
        <div className={`forms-container gap-2 justify-center mb-4 p-2 rounded-lg ${
            forms.length === 6 ? 'grid grid-cols-3' :
                forms.length > 6 ? 'grid grid-cols-5' :
                    'flex'
        }`}>
            {forms.map((form) => (
                <button
                    key={form.id}
                    onClick={() => onFormSelect(form.id)}
                    className={`form-button p-2 rounded-lg transition-all duration-200
                ${form.id === currentPokemonId ? 'bg-white/70 ring-2 ring-white' : 'bg-white/30'} 
                hover:bg-white/70`}
                    title={form.name}
                >
                    <img
                        src={formSprites[form.name] || form.image}
                        alt={`${form.name} form`}
                        className="w-10 h-10 object-cover"
                    />
                </button>
            ))}
        </div>
    );
};

export default FormSelector;
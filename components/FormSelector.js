import React, {useState, useEffect} from "react";
import gmaxIcon from '../public/gmax.png';
import normalIcon from '../public/pokeball-2.png'

const FormSelector = ({speciesInfo, onFormSelect, currentPokemonId}) => {
    const [forms, setForms] = useState([]);

    const getPokemonIdFromUrl = (url) => {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 2]);
    };

    const getFormIcon = (pokemonName) => {
        if (pokemonName.includes('-mega')) {
            return `/icons/megastones/${pokemonName}.png`;
        } if (pokemonName.includes('-origin') || pokemonName.includes('-primal') || pokemonName.includes('-black') || pokemonName.includes('-white')) {
            return `/icons/orbs/${pokemonName}.png`;
        } else if (pokemonName.includes('-gmax')) {
            return gmaxIcon;
        }
        return normalIcon;
    };

    useEffect(() => {
        if (speciesInfo?.varieties && speciesInfo.varieties.length > 1) {
            const formsList = speciesInfo.varieties.map(variety => {
                return {
                    name: variety.pokemon.name,
                    image: getFormIcon(variety.pokemon.name),
                    id: getPokemonIdFromUrl(variety.pokemon.url),
                    isDefault: variety.is_default
                };
            });
            setForms(formsList);

            console.log(formsList);
        }
    }, [speciesInfo]);

    if (forms.length <= 1) return null;

    return (
        <div className="forms-container flex gap-2 justify-center mb-4 p-2 rounded-lg">
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
                        src={(form.name.includes('mega') || form.name.includes('origin') || form.name.includes('primal') || form.name.includes('black') || form.name.includes('white')) ? form.image : form.image.src}
                        alt={`${form.name} form`}
                        className="w-8 h-8 object-contain"
                    />
                </button>
            ))}
        </div>
    );
};

export default FormSelector;
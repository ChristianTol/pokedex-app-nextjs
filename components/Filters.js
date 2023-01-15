import Image from "next/image";
import { REGIONS, TYPES, SORT_BY } from "../constants/constants";

const Filters = ({ filters, updateFilters }) => {
  return (
    <div className="grid grid-cols-2 mb-20 lg:grid-cols-4">
      <div className="flex flex-col mb-10 justify-center items-center gap-2 text-amber-400 lg:mb-0">
        <label
          htmlFor="region-filter"
          className="text-amber-400 font-semibold text-2xl"
        >
          Region
        </label>
        <select
          className="w-[200px] border-box rounded-md p-1 bg-slate-800 border-slate-900 border-2"
          id="region-filter"
          value={filters.region}
          onChange={(e) => updateFilters({ region: e.target.value })}
        >
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region.charAt(0).toUpperCase() + region.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-10 justify-center items-center gap-2 text-amber-400 lg:mb-0">
        <label
          htmlFor="type-filter"
          className="text-amber-400 font-semibold text-2xl"
        >
          Type
        </label>
        <select
          className="w-[200px] border-box rounded-md p-1 bg-slate-800 border-slate-900 border-2"
          id="type-filter"
          value={filters.type}
          onChange={(e) => updateFilters({ type: e.target.value })}
        >
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {/* <Image
                src={`/icons/${type}.svg`}
                alt="type"
                width={15}
                height={15}
              /> */}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 text-amber-400">
        <label
          htmlFor="sort-filter"
          className="text-amber-400 font-semibold text-2xl"
        >
          Sort By
        </label>
        <select
          className="w-[200px] border-box rounded-md p-1 bg-slate-800 border-slate-900 border-2"
          id="sort-filter"
          value={filters.sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value })}
        >
          {SORT_BY.map((sortMethod) => (
            <option key={sortMethod} value={sortMethod}>
              {sortMethod.charAt(0).toUpperCase() + sortMethod.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 text-amber-400">
        <label
          htmlFor="search-filter"
          className="text-amber-400 font-semibold text-2xl"
        >
          Search
        </label>
        <input
          className="w-[200px] border-box rounded-md p-1 bg-slate-800 border-slate-900 border-2"
          id="search-filter"
          type="text"
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Filters;

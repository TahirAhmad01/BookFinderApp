import React from "react";
import SearchInput from "./SearchInput";
import GenreSkeleton from "./GenreSkeleton";

const DesktopFilters = (props) => {
  const {
    searchTerm,
    handleSearchChange,
    clearSearch,
    loading,
    uniqueGenres,
    selectedGenre,
    page,
    handleGenreChange,
  } = props || {};
  
  return (
    <div className="md:col-span-4 lg:col-span-3 hidden md:block">
      <div className="pt-3 pb-4 text-xl font-semibold border-b mb-3">
        Filters
      </div>
      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        clearSearch={clearSearch}
      />
      <div className="pt-6 pb-2 mb-4 text-xl font-semibold border-b-2">
        Genres
      </div>
      {loading
        ? [...Array(10)].map((_, index) => <GenreSkeleton key={index} />)
        : uniqueGenres.map((genre, idx) => (
            <div className="flex items-center mb-4" key={idx}>
              <input
                id={`genre-checkbox-desktop-${idx}`}
                type="checkbox"
                value={genre}
                onChange={handleGenreChange}
                checked={
                  page == "whitelist"
                    ? selectedGenre.includes(genre)
                    : selectedGenre === genre
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`genre-checkbox-desktop-${idx}`}
                className="ml-2 text-sm font-medium text-gray-900"
              >
                {genre}
              </label>
            </div>
          ))}
    </div>
  );
};

export default DesktopFilters;

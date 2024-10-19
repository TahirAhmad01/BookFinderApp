import React from "react";
import SearchInput from "./SearchInput";
import GenreSkeleton from "./GenreSkeleton";

const MobileFilterDrawer = (props) => {
  const {
    isOpen,
    toggleDrawer,
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
    <div
      className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg p-5 transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } md:hidden`}
    >
      <button onClick={toggleDrawer} className="mb-4 text-red-500">
        Close
      </button>
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
                id={`genre-checkbox-${idx}`}
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
                htmlFor={`genre-checkbox-${idx}`}
                className="ml-2 text-sm font-medium text-gray-900"
              >
                {genre}
              </label>
            </div>
          ))}
    </div>
  );
};

export default MobileFilterDrawer;

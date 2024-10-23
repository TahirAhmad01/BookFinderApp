import React, { useState, useEffect } from "react";
import BookList from "../components/shared/BookList";
import DesktopFilters from "../components/shared/DesktopFilters";
import MobileFilterDrawer from "../components/shared/MobileFilterDrawer";
import { FaFilter } from "react-icons/fa6";

const WishlistPage = ({ wishlist, onWishlistToggle }) => {
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    filterWishlist();
  }, [searchTerm, selectedGenres, wishlist, currentPage]);

  const filterWishlist = () => {
    setLoading(true);
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = wishlist.filter(
      (book) =>
        (book?.title.toLowerCase().includes(searchTermLower) ||
          book?.subjects.some((subject) =>
            subject.toLowerCase().includes(searchTermLower)
          )) &&
        (selectedGenres.length === 0 ||
          selectedGenres.some((genre) =>
            book?.bookshelves.map(removeBrowsingPrefix).includes(genre)
          ))
    );

    const itemsPerPage = 32;
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setFilteredWishlist(
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
    setLoading(false);
  };

  const removeBrowsingPrefix = (genre) =>
    genre.startsWith("Browsing: ") ? genre.replace("Browsing: ", "") : genre;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres((prevSelectedGenres) =>
      checked
        ? [...prevSelectedGenres, value]
        : prevSelectedGenres.filter((genre) => genre !== value)
    );
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setCurrentPage(1);
  };

  const uniqueGenres = [
    ...new Set(
      wishlist.flatMap((book) => book.bookshelves.map(removeBrowsingPrefix))
    ),
  ].sort();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div>
      <MobileFilterDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        loading={loading}
        uniqueGenres={uniqueGenres}
        selectedGenre={selectedGenres}
        handleGenreChange={handleGenreChange}
        page="whitelist"
        clearFilter={clearFilter}
      />
      <div className="md:grid grid-cols-12 gap-10">
        <div className="md:col-span-9 col-span-12">
          <div className="flex justify-between items-center mb-3 border-b">
            <div className="font-semibold pt-3 pb-4 text-xl w-full">
              White List
            </div>
            <button
              onClick={toggleDrawer}
              className="rounded-md border px-4 py-1 h-10 flex items-center gap-2 md:hidden"
            >
              <FaFilter /> Filter
            </button>
          </div>
          <BookList
            books={filteredWishlist}
            loading={loading}
            wishlist={wishlist}
            onWishlistToggle={onWishlistToggle}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        <DesktopFilters
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          loading={loading}
          uniqueGenres={uniqueGenres}
          selectedGenre={selectedGenres}
          handleGenreChange={handleGenreChange}
          page="whitelist"
          clearFilter={clearFilter}
        />
      </div>
    </div>
  );
};

export default WishlistPage;

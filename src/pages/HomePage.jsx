import React, { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "../utils/debounce";
import { fetchBooks } from "../utils/api/bookApi";
import BookList from "../components/shared/BookList";
import MobileFilterDrawer from "../components/shared/MobileFilterDrawer";
import DesktopFilters from "../components/shared/DesktopFilters";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageHelper";
import { FaFilter } from "react-icons/fa6";

const removeBrowsingPrefix = (bookshelf) => {
  const prefix = "Browsing: ";
  return bookshelf.startsWith(prefix)
    ? bookshelf.slice(prefix.length)
    : bookshelf;
};

const HomePage = ({ wishlist, onWishlistToggle }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get("page"), 10) || 1;
    const search = query.get("search") || "";
    const genre = query.get("genres") || null;

    setCurrentPage(page);
    setSearchTerm(search);
    setSelectedGenre(genre);
  }, [location]);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    const searchParam = searchTerm
      ? `&search=${encodeURIComponent(searchTerm)}`
      : "";
    const genreParam = selectedGenre
      ? `&topic=${encodeURIComponent(selectedGenre)}`
      : "";
    const data = await fetchBooks(currentPage, searchParam, genreParam);
    setBooks(data.results);
    setTotalPages(Math.ceil(data.count / 32));
    setLoading(false);
  }, [currentPage, debounceSearch, selectedGenre]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    updateUniqueGenres();
  }, [books]);

  useEffect(() => {
    loadGenresFromLocalStorage();
  }, []);

  const debouncedSearchChange = useMemo(
    () =>
      debounce((value) => {
        updateNavigation(1, value);
        setDebounceSearch(value);
      }, 700),
    [navigate]
  );

  const handleSearchChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchChange(value);
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    const newGenre = checked ? value : null;
    setSelectedGenre(newGenre);
    updateNavigation(1, searchTerm, newGenre);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateNavigation(newPage);
  };

  const updateUniqueGenres = () => {
    const newGenres = [
      ...new Set(
        books?.flatMap((book) => book.bookshelves.map(removeBrowsingPrefix))
      ),
    ];

    const storedGenres = getGenresFromLocalStorage();
    const mergedGenres = [...new Set([...storedGenres, ...newGenres])];

    setUniqueGenres(mergedGenres);
    updateGenresInLocalStorage(mergedGenres);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const clearSearch = () => {
    setSearchTerm("");
    debouncedSearchChange("");
    updateNavigation(currentPage);
  };

  const updateNavigation = (
    page,
    search = searchTerm,
    genre = selectedGenre
  ) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("page", page);
    if (search) newSearchParams.set("search", search);
    if (genre) newSearchParams.set("genres", genre);
    navigate(`?${newSearchParams.toString()}`);
  };

  const loadGenresFromLocalStorage = () => {
    const storedGenres = getGenresFromLocalStorage();
    if (storedGenres.length > 0) {
      setUniqueGenres(storedGenres);
    }
  };

  const updateGenresInLocalStorage = (genres) => {
    setLocalStorageItem("uniqueGenres", genres);
  };

  const getGenresFromLocalStorage = () => {
    return getLocalStorageItem("uniqueGenres") || [];
  };

  return (
    <div>
      <MobileFilterDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
        loading={loading}
        uniqueGenres={uniqueGenres}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
      />
      <div className="md:grid grid-cols-12 gap-5 w-full">
        <div className="md:col-span-8 lg:col-span-9">
          <div className="flex justify-between items-center mb-3 border-b">
            <div className="font-semibold pt-3 pb-4 text-xl w-full">
              Book List
            </div>
            <button
              onClick={toggleDrawer}
              className="rounded-md border px-4 py-1 h-10 flex items-center gap-2 md:hidden"
            >
              <FaFilter /> Filter
            </button>
          </div>
          <BookList
            books={books}
            loading={loading}
            wishlist={wishlist}
            onWishlistToggle={onWishlistToggle}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <DesktopFilters
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          clearSearch={clearSearch}
          loading={loading}
          uniqueGenres={uniqueGenres}
          selectedGenre={selectedGenre}
          handleGenreChange={handleGenreChange}
        />
      </div>
    </div>
  );
};

export default HomePage;

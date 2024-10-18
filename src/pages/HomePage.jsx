import React, { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "../utils/debounce";
import { fetchBooks } from "../utils/api/bookApi";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import SearchInput from "../components/shared/SearchInput";
import { useNavigate, useLocation } from "react-router-dom";
import SkeletonCard from "../components/shared/SkeletonCard";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageHelper";
import GenreSkeleton from "../components/shared/GenreSkeleton";

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
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [uniqueGenres, setUniqueGenres] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get("page"), 10) || 1;
    const search = query.get("search") || "";
    const genres = query.get("genres") ? query.get("genres").split(",") : [];

    setCurrentPage(page);
    setSearchTerm(search);
    setSelectedGenres(genres);
  }, [location]);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    const searchParam = searchTerm
      ? `&search=${encodeURIComponent(searchTerm)}`
      : "";
    const genresParam =
      selectedGenres.length > 0
        ? `&topic=${encodeURIComponent(selectedGenres.join(","))}`
        : "";
    const data = await fetchBooks(currentPage, searchParam, genresParam);
    setBooks(data.results);
    setTotalPages(Math.ceil(data.count / 32));
    setLoading(false);
  }, [currentPage, debounceSearch, selectedGenres]);

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
      }, 700),
    [navigate, selectedGenres]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchChange(value);
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    const updatedGenres = checked
      ? [...selectedGenres, value]
      : selectedGenres.filter((genre) => genre !== value);

    setSelectedGenres(updatedGenres);
    updateNavigation(1, searchTerm, updatedGenres);
    updateGenresInLocalStorage(updatedGenres);
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

  const getGenresFromLocalStorage = () => {
    return getLocalStorageItem("genres");
  };

  const updateGenresInLocalStorage = (genres) => {
    setLocalStorageItem("genres", genres);
  };

  const loadGenresFromLocalStorage = () => {
    const storedGenres = getGenresFromLocalStorage();
    setUniqueGenres(storedGenres);
  };

  const updateNavigation = (
    newPage = 1,
    search = searchTerm,
    genres = selectedGenres
  ) => {
    navigate(
      `?search=${encodeURIComponent(search)}&genres=${encodeURIComponent(
        genres.join(",")
      )}&page=${newPage}`
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateNavigation(1, "");
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-10">
        <div className="md:col-span-9 col-span-12">
          <div className="flex gap-3 flex-wrap">
            <div className="font-semibold pt-3 pb-4 text-xl">Book List</div>
            {loading ? (
              <div className="grid lg:grid-cols-2 grid-cols-2 gap-3 justify-items-center w-full">
                {[...Array(10)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center text-lg">No books found</div>
            ) : (
              <div>
                <div className="grid lg:grid-cols-2 grid-cols-2 gap-3 justify-items-center">
                  {books.map((book) => (
                    <BookCard
                      book={book}
                      key={book.id}
                      isWishlisted={wishlist.some(
                        (item) => item.id === book.id
                      )}
                      onWishlistToggle={onWishlistToggle}
                    />
                  ))}
                </div>
                <div className="py-4 flex justify-center">
                  {totalPages > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3 hidden md:block">
          <div className="pt-3 pb-2 mb-4 text-xl font-semibold border-b-2">
            Filter
          </div>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            clearSearch={clearSearch}
          />
          <div>
            <div className="pt-6 pb-2 mb-4 text-xl font-semibold border-b-2">
              Genres
            </div>
            {loading ? (
              <>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
              <GenreSkeleton/>
  
              </>
            ) : (
              uniqueGenres.map((genre, idx) => (
                <div className="flex items-center mb-4" key={idx}>
                  <input
                    id={`genre-checkbox-${idx}`}
                    type="checkbox"
                    value={genre}
                    onChange={handleGenreChange}
                    checked={selectedGenres.includes(genre)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`genre-checkbox-${idx}`}
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    {genre}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

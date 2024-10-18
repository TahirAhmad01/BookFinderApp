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
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [uniqueGenres, setUniqueGenres] = useState([]);

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
      }, 700),
    [navigate]
  );

  const handleSearchChange = (e) => {
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
    genre = selectedGenre
  ) => {
    navigate(
      `?search=${encodeURIComponent(search)}&genres=${encodeURIComponent(
        genre || ""
      )}&page=${newPage}`
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateNavigation(1, "");
  };

  return (
    <div className="md:grid grid-cols-12 gap-10 w-full">
      <div className="md:col-span-8 lg:col-span-9 col-span-12 w-full">
        <div>
          <div className="font-semibold pt-3 pb-4 text-xl w-full">
            Book List
          </div>
          <div className="w-full">
            {loading ? (
              <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-3 justify-items-center w-full">
                {[...Array(10)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center text-lg">No books found</div>
            ) : (
              <div>
                <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-3 justify-items-center w-full">
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
      </div>
      <div className="lg:col-span-3 md:col-span-4 hidden md:block">
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
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
              <GenreSkeleton />
            </>
          ) : (
            uniqueGenres.map((genre, idx) => (
              <div className="flex items-center mb-4" key={idx}>
                <input
                  id={`genre-checkbox-${idx}`}
                  type="checkbox"
                  value={genre}
                  onChange={handleGenreChange}
                  checked={selectedGenre === genre}
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
  );
};

export default HomePage;

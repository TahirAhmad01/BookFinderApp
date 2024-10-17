import React, { useState, useEffect } from "react";
import { fetchBooks } from "../utils/api/bookApi";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import SearchInput from "../components/shared/SearchInput";
import { useNavigate, useLocation } from "react-router-dom";

const HomePage = ({ wishlist, onWishlistToggle }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get("page"), 10) || 1;
    setCurrentPage(page);
  }, [location]);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const data = await fetchBooks(currentPage);
      setBooks(data.results);
      setTotalPages(Math.ceil(data.count / 32));
      setLoading(false);
    };
    loadBooks();
  }, [currentPage]);

  useEffect(() => {
    filterBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedGenres, books]);

  const filterBooks = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = books.filter(
      (book) =>
        (book.title.toLowerCase().includes(searchTermLower) ||
          book.subjects.some((subject) =>
            subject.toLowerCase().includes(searchTermLower)
          )) &&
        (selectedGenres.length === 0 ||
          selectedGenres.some((genre) =>
            book.bookshelves.map(removeBrowsingPrefix).includes(genre)
          ))
    );

    setFilteredBooks(filtered);
  };

  const removeBrowsingPrefix = (genre) =>
    genre.startsWith("Browsing: ") ? genre.replace("Browsing: ", "") : genre;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres((prevSelectedGenres) =>
      checked
        ? [...prevSelectedGenres, value]
        : prevSelectedGenres.filter((genre) => genre !== value)
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(`?page=${newPage}`);
  };

  const uniqueGenres = [
    ...new Set(
      books.flatMap((book) => book.bookshelves.map(removeBrowsingPrefix))
    ),
  ].sort();

  return (
    <div>
      <div className="grid grid-cols-12 gap-10 ">
        <div className="md:col-span-9 col-span-12">
          <div className="flex gap-3 flex-wrap">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <div className="font-semibold pt-3 pb-4 text-xl">Book List</div>
                <div className="grid lg:grid-cols-2 grid-cols-2 gap-3 justify-items-center">
                  {filteredBooks.map((book) => (
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3 hidden md:block">
          <div className="pt-3 pb-2 mb-4 text-xl font-semibold border-b-2">
            Filter
          </div>
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
          <div>
            <div className="pt-6 pb-2 mb-4 text-xl font-semibold border-b-2">
              Genres
            </div>

            {uniqueGenres.map((genre, idx) => (
              <div className="flex items-center mb-4" key={idx}>
                <input
                  id={`genre-checkbox-${idx}`}
                  type="checkbox"
                  value={genre}
                  onChange={handleGenreChange}
                  checked={selectedGenres.includes(genre)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`genre-checkbox-${idx}`}
                  className="ms-2 text-xs font-medium text-gray-900 dark:text-gray-300"
                >
                  {genre}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

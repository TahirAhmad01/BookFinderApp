import React, { useState, useEffect } from "react";
import { fetchBooks } from "../utils/api/bookApi";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import SearchInput from "../components/shared/SearchInput";

const HomePage = ({ wishlist, onWishlistToggle }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const data = await fetchBooks();
      setBooks(data.results);
      setLoading(false);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedGenres, books, currentPage]);

  const filterBooks = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = books.filter(
      (book) =>
        (book.title.toLowerCase().includes(searchTermLower) ||
          book.subjects.some((subject) =>
            subject.toLowerCase().includes(searchTermLower)
          )) &&
        (selectedGenres.length === 0 ||
          selectedGenres.some((genre) => book.subjects.includes(genre)))
    );

    setTotalPages(Math.ceil(filtered.length / 32)); 
    setFilteredBooks(filtered.slice((currentPage - 1) * 32, currentPage * 32));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres(
      (prevSelectedGenres) =>
        checked
          ? [...prevSelectedGenres, value] 
          : prevSelectedGenres.filter((genre) => genre !== value)
    );
    setCurrentPage(1);
  };

  const uniqueGenres = [
    ...new Set(books.flatMap((book) => book.subjects)),
  ].sort();

  return (
    <div>
      <div></div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr] md:gap-5 lg:grid-cols-[290px_1fr] lg:gap-10 w-full">
        <div>
          <div className="pt-6 pb-2 mb-4 text-xl font-semibold border-b-2">Filter</div>
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
          <div>
            <div className="pt-6 pb-2 mb-4 text-xl font-semibold border-b-2">Genres</div>
            {uniqueGenres.map((genre) => (
              <div key={genre}>
                <input
                  type="checkbox"
                  value={genre}
                  onChange={handleGenreChange}
                  checked={selectedGenres.includes(genre)}
                />
                <label>{genre}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredBooks.map((book) => (
              <BookCard
                book={book}
                key={book.id}
                isWishlisted={wishlist.some((item) => item.id === book.id)}
                onWishlistToggle={onWishlistToggle}
              />
            ))
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default HomePage;

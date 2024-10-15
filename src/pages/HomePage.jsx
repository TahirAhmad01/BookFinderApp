import React, { useState, useEffect } from "react";
import { fetchBooks } from "../utils/api/bookApi";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";

const HomePage = ({ wishlist, onWishlistToggle }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");

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
  }, [searchTerm, selectedGenre, books, currentPage]);

  const filterBooks = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = books.filter(
      (book) =>
        (book.title.toLowerCase().includes(searchTermLower) ||
          book.subjects.some((subject) =>
            subject.toLowerCase().includes(searchTermLower)
          )) &&
        (selectedGenre ? book.subjects.includes(selectedGenre) : true)
    );

    setTotalPages(Math.ceil(filtered.length / 32)); // Calculate total pages based on the filtered results
    setFilteredBooks(filtered.slice((currentPage - 1) * 32, currentPage * 32));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  const uniqueGenres = [
    ...new Set(books.flatMap((book) => book.subjects)),
  ].sort();

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by title or genre..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr] md:gap-5 lg:grid-cols-[290px_1fr] lg:gap-10 w-full">
        <div>filter</div>
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

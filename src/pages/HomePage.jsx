import React, { useState, useEffect } from "react";
import { fetchBooks } from "../utils/api/bookApi";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";

const HomePage = ({ wishlist, onWishlistToggle }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const data = await fetchBooks(searchTerm, currentPage);
      const filteredBooks = data.results.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.subjects.some((subject) =>
            subject.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setBooks(filteredBooks);
      setTotalPages(Math.ceil(data.count / 32));
      setLoading(false);
    };
    loadBooks();
  }, [searchTerm, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by title or genre..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr] md:gap-5 lg:grid-cols-[290px_1fr] lg:gap-10 w-full">
        <div>filter</div>
        <div className="flex gap-3 flex-wrap">
          {loading ? (
            <p>Loading...</p>
          ) : (
            books.map((book) => (
              <BookCard
                book={book}
                key={book.id}
                isWishlisted={wishlist.some((item) => item.id === book.id)}
                onWishlistToggle={onWishlistToggle}
              />
            ))
          )}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomePage;

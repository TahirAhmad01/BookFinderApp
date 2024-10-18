import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import SearchInput from "../components/shared/SearchInput";

const WishlistPage = ({ wishlist, onWishlistToggle }) => {
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    filterWishlist();
  }, [searchTerm, selectedGenres, wishlist, currentPage]);

  const filterWishlist = () => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = wishlist.filter(
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

    const itemsPerPage = 32;
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setFilteredWishlist(
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
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

  const uniqueGenres = [
    ...new Set(
      wishlist.flatMap((book) => book.bookshelves.map(removeBrowsingPrefix))
    ),
  ].sort();

  return (
    <div>
      <div className="md:grid grid-cols-12 gap-10">
        <div className="md:col-span-9 col-span-12">
          <div className="flex gap-3 flex-wrap">
            <div>
              <div className="font-semibold pt-3 pb-4 text-xl">Wishlist</div>
              {filteredWishlist.length === 0 ? (
                <p>No books found in your wishlist.</p>
              ) : (
                <div>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 justify-items-center pb-3">
                    {filteredWishlist.map((book) => (
                      <BookCard
                        book={book}
                        key={book.id}
                        isWishlisted={true}
                        onWishlistToggle={onWishlistToggle}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              )}
            </div>
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
                  id={`wishlist-genre-checkbox-${idx}`}
                  type="checkbox"
                  value={genre}
                  onChange={handleGenreChange}
                  checked={selectedGenres.includes(genre)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`wishlist-genre-checkbox-${idx}`}
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

export default WishlistPage;

import React, { useEffect, useState } from "react";
import {
  fetchBookDetails,
  fetchRelatedBooks,
  fetchRandomBooks,
} from "../utils/api/bookApi";
import { Link, useParams } from "react-router-dom";
import Error from "../components/Error";
import BookCard from "../components/shared/BookCard";
import SkeletonCard from "../components/shared/SkeletonCard";

function BookDetailsPage() {
  const { id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]);
  const [error, setError] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [availableBooksLoading, setAvailableBooksLoading] = useState(true);

  useEffect(() => {
    const getBookData = async () => {
      setBookLoading(true);
      setAvailableBooksLoading(true);
      try {
        const data = await fetchBookDetails(id);
        if (!data) {
          throw new Error("Book not found");
        }
        setBookDetails(data);
        setBookLoading(false);

        const related = await fetchRelatedBooks(data?.title);
        const relatedResults = related?.results.slice(0, 8);
        setRelatedBooks(relatedResults || []);

        if (relatedResults.length < 8) {
          const random = await fetchRandomBooks(8 - relatedResults.length);
          setRandomBooks(random.results || []);
        }
        setAvailableBooksLoading(false);
      } catch (err) {
        setError(err.message);
        setBookLoading(false);
        setAvailableBooksLoading(false);
      }
    };
    getBookData();
  }, [id]);

  if (error) {
    return <Error error={error} />;
  }

  if (bookLoading) {
    return <div>Loading book details...</div>;
  }

  if (!bookDetails) {
    return <div>No book details available.</div>;
  }

  const booksToDisplay = [...relatedBooks, ...randomBooks].filter(
    (book) => book.id !== bookDetails.id
  );

  return (
    <div className="book-details-page container mx-auto p-4">
      <div className="main-details mb-8 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          {bookDetails.formats && bookDetails.formats["image/jpeg"] ? (
            <img
              className="mt-6 w-full h-auto"
              src={bookDetails.formats["image/jpeg"]}
              alt={`${bookDetails.title} cover`}
            />
          ) : (
            <div className="mt-6 w-full h-40 bg-gray-200 flex items-center justify-center">
              <span>No Cover Image Available</span>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 pl-4">
          <h1 className="text-2xl font-bold">
            {bookDetails.title || "Untitled"}
          </h1>
          <p>
            <strong>Author:</strong>{" "}
            {bookDetails.authors?.length > 0
              ? bookDetails.authors.map((author) => author.name).join(", ")
              : "Unknown Author"}
          </p>
          <p>
            <strong>Subjects:</strong>{" "}
            {bookDetails.subjects?.length > 0
              ? bookDetails.subjects.join(", ")
              : "No Subjects Available"}
          </p>
          <p>
            <strong>Bookshelves:</strong>{" "}
            {bookDetails.bookshelves?.length > 0
              ? bookDetails.bookshelves.join(", ")
              : "No Bookshelves Available"}
          </p>
          <p>
            <strong>Language:</strong>{" "}
            {bookDetails.languages?.length > 0
              ? bookDetails.languages.join(", ")
              : "Language Not Specified"}
          </p>
          <p>
            <strong>Download Count:</strong> {bookDetails.download_count || 0}
          </p>
          <div className="book-formats mt-4">
            <h3 className="text-xl font-semibold">Available Formats:</h3>
            <ul>
              {bookDetails.formats ? (
                Object.entries(bookDetails.formats).map(([format, url]) => (
                  <li key={format}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {format}
                    </a>
                  </li>
                ))
              ) : (
                <li>No formats available</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="related-books mt-12">
        <h2 className="text-xl font-semibold mb-4">Available Books</h2>
        {availableBooksLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} disableWhitelistButton />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {booksToDisplay.map((book) => (
              <BookCard book={book} key={book?.id} disableWhitelistButton />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetailsPage;

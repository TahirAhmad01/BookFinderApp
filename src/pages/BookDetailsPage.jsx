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
import BookDetailsPageSkeleton from "../components/shared/BookDetailsPageSkeleton";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

function BookDetailsPage({ wishlist, onWishlistToggle }) {
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
    return (
      <div>
        <BookDetailsPageSkeleton />
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} disableWhitelistButton />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!bookDetails) {
    return <div>No book details available.</div>;
  }

  // console.log(wishlist);
  const isBookInWishlist = wishlist.some((book) => book.id === bookDetails.id);

  const handleWhitelistToggle = () => {
    onWishlistToggle(bookDetails);
  };

  const booksToDisplay = [...relatedBooks, ...randomBooks].filter(
    (book) => book.id !== bookDetails.id
  );

  return (
    <div className="book-details-page container mx-auto p-4">
      <div className="main-details mb-8 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center overflow-hidden">
          {bookDetails.formats && bookDetails.formats["image/jpeg"] ? (
            <img
              className="mt-6 max-w-[500px] h-auto"
              src={bookDetails.formats["image/jpeg"]}
              alt={`${bookDetails.title} cover`}
            />
          ) : (
            <div className="mt-6 w-full h-40 bg-gray-200 flex items-center justify-center">
              <span>No Cover Image Available</span>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 pl-4 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">
            {bookDetails.title || "Untitled"}
          </h1>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/3">
                    Attribute
                  </th>
                  <th scope="col" className="px-6 py-3 w-2/3">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    Author
                  </th>
                  <td className="px-6 py-4">
                    {bookDetails?.authors?.length > 0
                      ? bookDetails.authors
                          .map((author) => author.name)
                          .join(", ")
                      : "Unknown Author"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    Subjects
                  </th>
                  <td className="px-6 py-4">
                    {bookDetails?.subjects?.length > 0
                      ? bookDetails.subjects.join(", ")
                      : "No Subjects Available"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    Bookshelves
                  </th>
                  <td className="px-6 py-4">
                    {bookDetails?.bookshelves?.length > 0
                      ? bookDetails.bookshelves.join(", ")
                      : "No Bookshelves Available"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    Language
                  </th>
                  <td className="px-6 py-4">
                    {bookDetails?.languages?.length > 0
                      ? bookDetails.languages.join(", ")
                      : "Language Not Specified"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    Download Count
                  </th>
                  <td className="px-6 py-4">
                    {bookDetails?.download_count ?? 0}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    Available Formats
                  </th>
                  <td className="px-6 py-4">
                    <ul>
                      {bookDetails?.formats ? (
                        Object.entries(bookDetails.formats).map(
                          ([format, url]) => (
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
                          )
                        )
                      ) : (
                        <li>No formats available</li>
                      )}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full text-left">
            <button
              onClick={handleWhitelistToggle}
              className="py-2 px-3 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 mt-3"
            >
              <div className="text-red-700 text-sm">
                {isBookInWishlist ? (
                  <div className="flex items-center gap-3">
                    <MdFavorite />{" "}
                    <span className="ml-1">Remove from Whitelist</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <MdFavoriteBorder />{" "}
                    <span className="ml-1">Add to Whitelist</span>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="related-books mt-12">
        <h2 className="text-xl font-semibold mb-4">Available Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {availableBooksLoading
            ? [...Array(6)].map((_, index) => (
                <SkeletonCard key={index} disableWhitelistButton />
              ))
            : booksToDisplay.map((book) => (
                <BookCard key={book.id} book={book} disableWhitelistButton />
              ))}
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPage;

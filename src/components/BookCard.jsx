import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book, onWishlistToggle, isWishlisted }) => {
  const { id, title, authors, bookshelves, formats, download_count } =
    book || {};

  const removeBrowsingPrefix = (genre) =>
    genre.startsWith("Browsing: ") ? genre.replace("Browsing: ", "") : genre;

  return (
    <React.Fragment>
      <div className="w-full border rounded-lg overflow-hidden flex flex-col justify-between">
        <Link to={`/books/${id}`}>
          <div className="mb-2 max-h-[200px] overflow-hidden">
            <img
              src={formats["image/jpeg"]}
              alt=""
              className="mx-auto block aspect-[1/1.4] w-full rounded-none bg-gray-200 object-cover"
            />
          </div>

          <div className="px-2">
            <h3 className="mb-2 font-semibold text-[#1a1668] duration-200 group-hover:text-primary sm:text-[15px] sm:leading-snug">
              {title}
            </h3>
            {/* <p className="mb-0.5 text-[15px] text-[#1d1d1d] sm:text-base">
              Author: {authors.map((a) => a.name).join(", ")}
            </p>
            <div className="text-xs flex flex-wrap gap-1">
              {bookshelves.map((genre, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center"
                >
                  {removeBrowsingPrefix(genre)}
                </div>
              ))}
            </div> */}
          </div>
        </Link>

        <div className="flex justify-between items-center px-2">
          <div className="text-sm text-gray-500">{download_count}</div>
          <button onClick={() => onWishlistToggle(book)} className="">
            {isWishlisted ? "❤️" : "♡"}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BookCard;

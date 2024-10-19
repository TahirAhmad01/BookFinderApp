import React from "react";
import { Link } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";

const BookCard = ({
  book,
  onWishlistToggle,
  isWishlisted,
  disableWhitelistButton,
}) => {
  const { id, title, authors, bookshelves, formats } = book || {};

  const removeBrowsingPrefix = (genre) =>
    genre.startsWith("Browsing: ") ? genre.replace("Browsing: ", "") : genre;

  return (
    <React.Fragment>
      <div className="w-full border rounded-lg overflow-hidden flex flex-col justify-between p-3 shadow-sm">
        <div
          className={`flex  items-center gap-3 ${
            disableWhitelistButton ? "max-h-[150px]" : "max-h-[230px]"
          }`}
        >
          <Link to={`/books/${id}`}>
            <div
              className={`overflow-hidden w-[90px] ${
                !disableWhitelistButton && "md:w-[160px]"
              } h-full`}
            >
              <img
                src={formats["image/jpeg"]}
                alt=""
                className="mx-auto block aspect-[1/1.5] h-full rounded-none bg-gray-200 object-cover"
              />
            </div>
          </Link>

          <div className="py-5">
            <Link to={`/books/${id}`}>
              <h3 className="font-semibold text-[#1a1668] duration-200 group-hover:text-primary sm:text-[15px] sm:leading-snug line-clamp-2">
                {title}
              </h3>
              <p className="mb-0.5 text-sm text-gray-500">
                {authors.map((a) => a.name).join(", ")}
              </p>
              {!disableWhitelistButton && (
                <div className="text-xs hidden md:flex flex-wrap gap-1 py-2">
                  {bookshelves.slice(0, 4).map((genre, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
                    >
                      {removeBrowsingPrefix(genre)}
                    </div>
                  ))}
                </div>
              )}
            </Link>

            {!disableWhitelistButton && (
              <button
                onClick={() => onWishlistToggle(book)}
                className="py-2 px-3 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 mt-3"
              >
                <div className="text-red-700 text-xl">
                  {isWishlisted ? <MdFavorite /> : <MdFavoriteBorder />}{" "}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BookCard;

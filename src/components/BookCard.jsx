import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book, onWishlistToggle, isWishlisted }) => {
  const { id, title, authors, subjects, formats } = book || {};

  return (
    <Link
      to={`/books/${id}`}
      className="block max-w-[250px]"
    >
      <div className="mb-5">
        <img
          src={formats["image/jpeg"]}
          alt=""
          className="mx-auto block aspect-[1/1.4] w-full rounded-md bg-gray-200 object-cover"
        />
      </div>
      <div className="">
        <h3 className="mb-2 font-semibold leading-tight text-[#1a1668] duration-200 group-hover:text-primary sm:text-[19px] sm:leading-snug">
          {title}
        </h3>
        <p className="mb-0.5 text-[15px] text-[#1d1d1d] sm:text-base">
          Author: {authors.map((a) => a.name).join(", ")}
        </p>
        <p className={`text-sm text-[#EAA451]"`}>
          Genre: {subjects.join(", ")}
        </p>

        <button onClick={() => onWishlistToggle(book)}>
          {isWishlisted ? "❤️" : "♡"}
        </button>
      </div>
    </Link>
  );
};

export default BookCard;

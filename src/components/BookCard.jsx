import React from "react";

const BookCard = ({ book, onWishlistToggle, isWishlisted }) => {
  const {title, authors, subjects, formats} = book|| {};
  return (
    <div>
      <img src={formats["image/jpeg"]} alt={book.title} />
      <h3>{title}</h3>
      <p>Author: {authors.map((a) => a.name).join(", ")}</p>
      <p>Genre: {subjects.join(", ")}</p>
      <button
        onClick={() => onWishlistToggle(book)}
      >
        {isWishlisted ? "❤️" : "♡"}
      </button>
    </div>
  );
};

export default BookCard;

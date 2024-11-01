import React from "react";
import BookCard from "./BookCard";
import Pagination from "./Pagination";
import SkeletonCard from "./SkeletonCard";

const BookList = (props) => {
  const {
    books,
    loading,
    wishlist,
    onWishlistToggle,
    totalPages,
    currentPage,
    onPageChange,
  } = props || {};

  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 justify-items-center w-full">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (books?.length === 0) {
    return (
      <div className="text-center text-lg dark:text-white">No books found</div>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-3 justify-items-center">
        {books?.map((book) => (
          <BookCard
            book={book}
            key={book?.id}
            isWishlisted={wishlist.some((item) => item?.id === book?.id)}
            onWishlistToggle={onWishlistToggle}
          />
        ))}
      </div>
      <div className="py-4 flex justify-center">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
};

export default BookList;

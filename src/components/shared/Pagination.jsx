const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (currentPage <= 2) {
      for (let i = 1; i <= Math.min(3, totalPages); i++) {
        pages.push(i);
      }
      if (totalPages > 3) {
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      }
    } else if (currentPage < totalPages - 2) {
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      if (currentPage < totalPages - 3) {
        pages.push("...");
      }
      pages.push(totalPages - 1);
      pages.push(totalPages);
    } else {
      pages.push(1);
      pages.push(2);
      pages.push("...");
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-wrap items-center space-x-1 sm:space-x-2 mt-4 justify-center py-4">
      <div className="block sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium 
            ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
        >
          Previous
        </button>
        <span className="mx-2 text-sm font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium 
            ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex flex-wrap items-center space-x-1 sm:space-x-2 ">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium 
            ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
        >
          Previous
        </button>

        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium 
              ${
                page === currentPage
                  ? "bg-blue-500 !text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              } ${
              page === "..."
                ? "cursor-not-allowed text-gray-500 dark:text-gray-600"
                : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium 
            ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

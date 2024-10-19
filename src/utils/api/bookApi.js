export const fetchBooks = async (
  pageNo,
  searchParam = "",
  genresParam = ""
) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }?${searchParam}&${genresParam}&page=${pageNo}`
  );
  const data = await response.json();
  return data;
};


export const fetchBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/${bookId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch book details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchRelatedBooks = async (searchQuery) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}?search=${encodeURIComponent(
        searchQuery
      )}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch related books");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
};


export const fetchRandomBooks = async (
  count,
  searchParam = "",
  genresParam = ""
) => {
  try {
    const pageNo = Math.floor(Math.random() * 10) + 1;
    const data = await fetchBooks(pageNo, searchParam, genresParam);

    const randomBooks = data.results
      .sort(() => 0.5 - Math.random())
      .slice(0, count);

    return { results: randomBooks }; 
  } catch (error) {
    console.error("Error fetching random books:", error);
    return { results: [] };
  }
};


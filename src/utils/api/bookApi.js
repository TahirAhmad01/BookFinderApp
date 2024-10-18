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

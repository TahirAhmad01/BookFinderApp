export const fetchBooks = async (pageNo) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}?page=${pageNo}`
  );
  const data = await response.json();
  return data;
};

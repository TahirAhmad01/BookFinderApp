import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WishlistPage from "./pages/WishlistPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleWishlistToggle = (book) => {
    if (wishlist.some((item) => item.id === book.id)) {
      setWishlist(wishlist.filter((item) => item.id !== book.id));
    } else {
      setWishlist([...wishlist, book]);
    }
  };

  return (
    <Router>
      <NavBar />
      <div className="max-w-screen-xl mx-auto px-5 pt-3 w-full overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
              />
            }
          />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import ThemeToggle from "../context/ThemeToggle";

const navLinks = [
  { link: "/", name: "Home" },
  { link: "/wishlist", name: "Wish List" },
];

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-gray-50 dark:bg-gray-900 shadow-md sticky top-0 w-full z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="h-10 w-10 flex justify-center items-center bg-gray-200 rounded-full dark:bg-gray-700">
            <img src={logo} className="h-6" alt="Logo" />
          </div>
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Book Finder
          </span>
        </Link>

        <div className="md:hidden flex items-center justify-end">
          <button
            onClick={toggleDrawer}
            className="p-2 text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <ThemeToggle />
        </div>

        <div
          className={`fixed top-0 right-0 w-3/4 h-full bg-white shadow-lg z-50 transform transition-transform dark:bg-gray-800 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between py-5 px-4 border-b dark:border-gray-700">
            <h2 className="text-2xl font-semibold dark:text-white">Menu</h2>
            <button onClick={toggleDrawer} aria-label="Close drawer">
              <svg
                className="w-6 h-6 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col p-4">
            {navLinks.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  className="block py-2 text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={closeDrawer}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:flex items-center justify-center md:space-x-3">
          <ul className="flex space-x-3">
            {navLinks.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  className="block py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

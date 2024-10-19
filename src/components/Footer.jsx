import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow dark:bg-gray-900 border-t mt-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-5">
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentYear}{" "}
          <a href="https://zeptoapps.com/" className="hover:underline">
            Zepto Apps
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;

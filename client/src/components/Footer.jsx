import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const { pathname } = useLocation();

  const isActive = useCallback(
    (path) => (pathname === path ? 'text-blue-500' : ''),
    [pathname]
  );

  return (
    <footer className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100 text-gray-800 gap-4 mt-auto">
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 font-semibold">
        <Link to="/" className={`hover:text-blue-500 ${isActive('/')}`}>
          Home
        </Link>
        <Link to="/about" className={`hover:text-blue-500 ${isActive('/about')}`}>
          About
        </Link>
      </div>

      <div className="flex space-x-4">
        <a
          href="https://www.instagram.com/aakashsingh3414"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold hover:text-blue-500"
        >
          Instagram
        </a>
        <a
          href="https://github.com/akashsingh3414"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold hover:text-blue-500"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/akashsingh3414"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold hover:text-blue-500"
        >
          LinkedIn
        </a>
      </div>

      <div className="flex space-x-4">
        <Link to="/privacyPolicy" className="text-sm font-semibold hover:text-blue-500">
          Privacy Policy
        </Link>
        <Link to="/termsAndconditions" className="text-sm font-semibold hover:text-blue-500">
          Terms & Conditions
        </Link>
      </div>

      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Thought Flow
        </Link>
        <span className="ml-2 text-sm text-gray-600">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

export default Footer;

import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Footer() {
  const theme = useSelector((state) => state.theme.theme);
  const { pathname } = useLocation();

  const isActive = useCallback(
    (path) => (pathname === path ? 'text-blue-500' : ''),
    [pathname]
  );

  return (
    <footer
      className={`flex flex-col md:flex-row justify-between items-center p-2 gap-2 w-full mt-2 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-200 text-black'
      }`}
    >
      <div className="flex flex-col space-y-3 font-bold">
        <Link to="/home">
          <button
            className={`${isActive('/home')} hover:${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } hover:bg-white hover:text-black hover:rounded-lg p-2`}
          >
            Home
          </button>
        </Link>
        <Link to="/about">
          <button
            className={`${isActive('/about')} hover:${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } hover:bg-white hover:text-black hover:rounded-lg p-2`}
          >
            About
          </button>
        </Link>
        <Link to="/projects">
          <button
            className={`${isActive('/projects')} hover:${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } hover:bg-white hover:text-black hover:rounded-lg p-2`}
          >
            Projects
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-center font-bold">
        <div className="mb-3">Follow Us</div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm font-semibold">
          {['Facebook', 'Discord', 'Instagram', 'Github', 'LinkedIn', 'X (Twitter)'].map((platform) => (
            <a
              href="#"
              key={platform}
              className={`hover:${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              } hover:bg-white hover:text-black hover:rounded-lg p-2`}
            >
              {platform}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center font-bold">
        <div className="mb-3">Policies</div>
        {['Privacy Policy', 'Terms and Conditions', 'Legal'].map((policy) => (
          <a
            href="#"
            key={policy}
            className={`text-sm font-semibold hover:${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } hover:bg-white hover:text-black hover:rounded-lg p-2`}
          >
            {policy}
          </a>
        ))}
      </div>

      <div className="flex items-center">
        <Link to="/" className="text-sm sm:text-xl font-bold">
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-300 ${
              theme === 'dark' ? '' : ''
            } `}
          >
            Thought Flow
          </span>
        </Link>
        <span
          className={`ml-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}

export default Footer;

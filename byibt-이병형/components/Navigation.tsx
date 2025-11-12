import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const isActive = (pageNum: number) => {
    return location.pathname === `/${pageNum}`;
  };

  return (
    <nav className="mb-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {pages.map((pageNum) => (
          <Link
            key={pageNum}
            to={`/${pageNum}`}
            className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
              isActive(pageNum)
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {pageNum}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;

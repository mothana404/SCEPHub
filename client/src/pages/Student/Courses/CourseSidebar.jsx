import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CourseSidebar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Call the onSearch function whenever the input changes
    if (onSearch) {
      onSearch(value.trim());
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-50 shadow-md p-4 rounded-lg space-y-6">

        {/* Search Widget */}
        <div className="widget">
          <h3 className="text-lg font-semibold mb-3">Search</h3>
          <div className="flex">
            <input
              type="text"
              name="input"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
            />
            <button className="bg-[#152c5a] text-white px-4 rounded-r" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter by Category */}
        <div className="widget">
          <h3 className="text-lg font-semibold mb-3">Filter by Category</h3>
          <ul className="space-y-2">
            {['Featured courses', 'Education', 'Business', 'IT Management', 'Development', 'Creative', 'Art & Design'].map((category, index) => (
              <li key={index} className="flex items-center">
                <input type="checkbox" id={`category-${index}`} className="mr-2" />
                <label htmlFor={`category-${index}`} className="text-gray-700 flex-1">{category}</label>
                <span className="text-gray-500">(8)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;

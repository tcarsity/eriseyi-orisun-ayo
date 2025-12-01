import React, { useEffect, useState } from "react";

const SearchBar = ({ search, setSearchParams }) => {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchParams(searchInput ? { search: searchInput } : {});
    }, 300);
    return () => clearTimeout(delay);
  }, [searchInput]);

  return (
    <div className="mt-3 input-group search">
      <input
        value={searchInput}
        type="text"
        className="form-control"
        placeholder="Search by name"
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <style>
        {`
          @keyframes spin {
            0% {transform: rotate(0deg); }
            100% {transform: rotate(360deg); }
          }
          
          `}
      </style>
    </div>
  );
};

export default React.memo(SearchBar);

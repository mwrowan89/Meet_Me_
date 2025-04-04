import React from "react";
import { useState } from "react";
import "../css/SearchBar.css";

const SearchBar = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const results = data.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="search-bar-div">
      <input
        id="search-bar"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* <ul>
        {searchResults.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default SearchBar;

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import '../../styles/admin.css';

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [query, setQuery] = useState('');

  const lastSearchRef = React.useRef(query);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== lastSearchRef.current) {
        onSearch(query);
        lastSearchRef.current = query;
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <div className="admin-search-bar">
      <div className="admin-search-icon">
        <Search size={18} />
      </div>
      <input
        type="text"
        className="admin-search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );

};

export default SearchBar;

import React from 'react';
import { Link } from 'react-router-dom';
import './components-css/search-results.css';

const SearchResults = ({ results, onClose }) => {
  if (!results.length) return null;

  return (
    <div className="search-results">
      {results.map(user => (
        <Link
          key={user.id}
          to={`/${user.id}`}
          className="search-result-item"
          onClick={onClose}
        >
          <div className="user-avatar">
            {user.images && user.images[0] ? (
              <img src={user.images[0].url} alt={user.display_name} />
            ) : (
              <div className="default-avatar">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{user.display_name}</span>
            <span className="user-followers">{user.followers} followers</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults; 
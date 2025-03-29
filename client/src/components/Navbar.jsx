import React, { useState, useEffect, useRef } from 'react'
import './components-css/navbar.css'
import { Search, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchResults from './SearchResults';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();
  const accessToken = new URLSearchParams(window.location.search).get('access_token');
  const refreshToken = new URLSearchParams(window.location.search).get('refresh_token');

  useEffect(() => {
    const fetchUserId = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        setUserId(data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (accessToken) fetchUserId();
  }, [accessToken]);

  const handleSignOut = () => {
    // Clear the access token from URL
    const newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
    navigate('/');
  };

  const getUrlWithTokens = (path) => {
    if (!accessToken) return path;
    return `${path}?access_token=${accessToken}${refreshToken ? `&refresh_token=${refreshToken}` : ''}`;
  };

  const handleSearch = async (query) => {
    if (!query.trim() || !accessToken) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/search/users?query=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search users');
      }

      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(true);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for 1.2 seconds
    searchTimeout.current = setTimeout(() => {
      handleSearch(query);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Clear the timeout since we're searching immediately
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      handleSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on results
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  return (
    <>
    <div className='container'>
        <div className='navbar'>
            <div className='logo'>
                <Link to={getUrlWithTokens("/rate")} className='logo-text'>ZlipBeat</Link>
            </div>
            <div className="search-container">
              <input 
                type="text" 
                className="search-bar" 
                placeholder="Search by Spotify username..." 
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                onClick={handleSearchClick}
                onBlur={handleSearchBlur}
              />
              <button className="search-button">
                {isSearching ? (
                  <Loader2 size={18} className="spinning" />
                ) : (
                  <Search size={18} />
                )}
              </button>
              {showSearchResults && (
                <div className="search-results-container">
                  {searchError && (
                    <div className="search-error">
                      {searchError}
                    </div>
                  )}
                  <SearchResults 
                    results={searchResults} 
                    onClose={() => setShowSearchResults(false)}
                  />
                </div>
              )}
            </div>
            <ul className='nav-list'>
                <li className='nav-item'><a href="/">New</a></li>
                <li className='nav-item'><a href="/">Trending</a></li>
                <li className='nav-item'>
                    <div className='user'>
                      <div className="user-icon" onClick={() => setShowDropdown(!showDropdown)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </div>
                      {showDropdown && (
                        <div className="dropdown-menu">
                          {userId && (
                            <Link to={getUrlWithTokens(`/${userId}`)} className="dropdown-item">
                              Show Profile
                            </Link>
                          )}
                          <a href="#" className="dropdown-item">
                            Upload your playlist
                          </a>
                          <button onClick={handleSignOut} className="dropdown-item">
                            Sign out
                          </button>
                        </div>
                      )}
                    </div>
                </li>
            </ul>
        </div>
    </div>
    </>
  )
}

export default Navbar
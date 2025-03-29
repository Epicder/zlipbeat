import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './components-css/user-profile.css';

const UserProfile = () => {
  const { spotify_name } = useParams();
  const [userData, setUserData] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = new URLSearchParams(window.location.search).get('access_token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/users/${spotify_name}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setPlaylists(data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    const fetchRatings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ratings/${spotify_name}`);
        const data = await response.json();
        setRatings(data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    if (accessToken) {
      Promise.all([fetchUserProfile(), fetchPlaylists(), fetchRatings()])
        .finally(() => setLoading(false));
    }
  }, [spotify_name, accessToken]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      {userData && (
        <div className="user-header">
          <div className="profile-image-container">
            {userData.images && userData.images[0] ? (
              <img src={userData.images[0].url} alt="User Profile" className="profile-image" />
            ) : (
              <div className="default-avatar">
                {userData.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <h2>{userData.display_name}</h2>
            <p>{userData.email || 'No email available'}</p>
          </div>
        </div>
      )}

      <div className="content-section">
        <h3>Your Ratings</h3>
        <div className="ratings-grid">
          {ratings.map((rating) => (
            <div key={rating._id} className="rating-card">
              <img src={rating.albumImage} alt={rating.songName} className="song-image" />
              <div className="song-info">
                <h4>{rating.songName}</h4>
                <p>{rating.artistName}</p>
                <div className="rating-stars">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={`star ${index < rating.rating ? 'filled' : ''}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {ratings.length === 0 && (
            <p className="no-ratings">You haven't rated any songs yet.</p>
          )}
        </div>
      </div>

      <div className="content-section">
        <h3>Your Playlists</h3>
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <a
              key={playlist.id}
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="playlist-card"
            >
              <img 
                src={playlist.images[0]?.url || 'https://via.placeholder.com/300'} 
                alt={playlist.name} 
                className="playlist-image" 
              />
              <h4>{playlist.name}</h4>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
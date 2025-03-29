import React, { useEffect, useState } from 'react';
import RatingStars from './RatingStars.jsx';
import { Link } from 'react-router-dom';
import './components-css/rate.css';

const Rate = () => {
  const accessToken = new URLSearchParams(window.location.search).get('access_token');
  const [playlists, setPlaylists] = useState([]);
  const [randomTrack, setRandomTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Get user ID
  useEffect(() => {
    const fetchUserId = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error('Error fetching user data');

        const data = await response.json();
        setUserId(data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (accessToken) fetchUserId();
  }, [accessToken]);

  // Obtener playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error('Error fetching playlists');

        const data = await response.json();
        setPlaylists(data.items || []); // Guardamos las playlists en el estado
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    if (accessToken) fetchPlaylists();
  }, [accessToken]);

  // Obtener una canción aleatoria
  const fetchRandomTrack = async () => {
    if (playlists.length === 0) return;

    setLoading(true);
    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${randomPlaylist.id}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Error fetching tracks');

      const data = await response.json();

      if (data.items.length > 0) {
        const randomTrack = data.items[Math.floor(Math.random() * data.items.length)].track;
        setRandomTrack(randomTrack);
      }
    } catch (error) {
      console.error('Error fetching random track:', error);
    }
    setLoading(false);
  };

  // Cargar la primera canción al iniciar
  useEffect(() => {
    if (playlists.length > 0) fetchRandomTrack();
  }, [playlists]);

  return (
    <div>
      <div className="rate-header">
        <h2>Rate a Song</h2>
        {userId && (
          <Link to={`/${userId}`} className="profile-link">
            View Your Profile
          </Link>
        )}
      </div>
      {loading ? (
        <p>Loading random song...</p>
      ) : randomTrack ? (
        <div className='rate-song-container'>
          <h3 className='song-name'>{randomTrack.name}</h3>
          <p className='song-artist'>by {randomTrack.artists.map(artist => artist.name).join(', ')}</p>
          <img src={randomTrack.album.images[0]?.url} alt={randomTrack.name} width="500" className='song-img'/>
          <div className='rate-container'>
            <h3>Rate it!</h3>
            <div className='rate-stars'>
              <RatingStars 
                maxRating={5}
                songId={randomTrack.id}
                songName={randomTrack.name}
                artistName={randomTrack.artists.map(artist => artist.name).join(', ')}
                albumImage={randomTrack.album.images[0]?.url}
                userId={userId}
              />
            </div>       
          </div>
          <button className='random-button' onClick={fetchRandomTrack}>Next</button>
        </div>
      ) : (
        <p>No random track found</p>
      )}
    </div>
  );
};

export default Rate;
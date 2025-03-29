import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const UserProfile = () => {
  const { spotify_name } = useParams();  // Capturamos el nombre de usuario de la URL
  const [userData, setUserData] = useState(null);
  const [playlists, setPlaylists] = useState([]);  // Guardaremos las playlists aquí
  const accessToken = new URLSearchParams(window.location.search).get('access_token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(`https://api.spotify.com/v1/users/${spotify_name}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserData(data);
    };


    const fetchPlaylists = async () => {
      const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setPlaylists(data.items);  // Almacenamos las playlists en el estado
    };

    if (accessToken) {
      fetchUserProfile();
      fetchPlaylists();  // Llamamos a la función para obtener las playlists
    }
  }, [spotify_name, accessToken]);

  return (
    <div>
      {userData ? (
        <div>
          <h2>{userData.display_name}</h2>
          <img src={userData.images[0]?.url} alt="User Profile" />
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {playlists.length > 0 ? (
        <div>
          <h3>Playlists</h3>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  {playlist.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading playlists...</p>
      )}
    </div>

  );
};

export default UserProfile;
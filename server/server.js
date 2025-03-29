require("dotenv").config();
const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const axios = require("axios");
const mongoose = require("mongoose");
const Rating = require("./models/Rating");
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zlipbeat')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email playlist-read-private"; // Permisos
    const authUrl = "https://accounts.spotify.com/authorize?" + querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI
    });
    res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code || null;
    
    // Obtener los tokens de acceso
    const tokenResponse = await axios.post("https://accounts.spotify.com/api/token",
        querystring.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { access_token, refresh_token } = tokenResponse.data;
    
    const userProfileResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    
    const spotifyName = userProfileResponse.data.id; 
    res.redirect(`http://localhost:5173/${spotifyName}?access_token=${access_token}&refresh_token=${refresh_token}`);
});

// Endpoint to save a song rating
app.post("/api/ratings", async (req, res) => {
  const { userId, songId, rating, songName, artistName, albumImage } = req.body;
  
  if (!userId || !songId || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Use findOneAndUpdate with upsert to create or update the rating
    const updatedRating = await Rating.findOneAndUpdate(
      { userId, songId },
      { userId, songId, rating, songName, artistName, albumImage },
      { upsert: true, new: true }
    );

    res.json({ message: "Rating saved successfully", rating: updatedRating });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: "Error saving rating" });
  }
});

// Endpoint to get user's ratings
app.get("/api/ratings/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    const ratings = await Rating.find({ userId });
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: "Error fetching ratings" });
  }
});

// Debug endpoint to get all ratings
app.get("/api/ratings", async (req, res) => {
  try {
    const allRatings = await Rating.find({});
    res.json(allRatings);
  } catch (error) {
    console.error('Error fetching all ratings:', error);
    res.status(500).json({ error: "Error fetching ratings" });
  }
});

// Search endpoint for Spotify users
app.get("/api/search/users", async (req, res) => {
  const { query } = req.query;
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!query || !accessToken) {
    return res.status(400).json({ error: "Missing query or access token" });
  }

  try {
    // First, try to get the user directly by ID
    const response = await axios.get(`https://api.spotify.com/v1/users/${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // If we get here, we found the user
    const user = response.data;
    const userData = {
      id: user.id,
      display_name: user.display_name,
      images: user.images,
      followers: user.followers.total
    };

    res.json([userData]); // Return as array to maintain consistent response format
  } catch (error) {
    console.error('Error searching users:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }
    if (error.response?.status === 404) {
      return res.json([]); // Return empty array if no user found
    }
    
    // For any other errors
    res.status(500).json({ error: "Error searching users" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
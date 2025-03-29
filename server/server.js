require("dotenv").config();
const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
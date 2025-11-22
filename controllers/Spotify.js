const messages = require('../utils/messages');
require('dotenv').config();

class Spotify {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.token = null;
        this.tokenExpiry = null;
    }

    getToken = async (req, res) => {

        if (this.token && Date.now() < this.tokenExpiry) {
            return res.json(messages.success('Token de Spotify obtenido con éxito', { token: this.token }));
        }

        const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

        try {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
            this.token = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);
            res.json(messages.success('Token de Spotify obtenido con éxito', { token: this.token }));
        } catch (error) {
            res.status(500).json(messages.error('Error al obtener el token de Spotify'));
        }
    }
}

module.exports = new Spotify();
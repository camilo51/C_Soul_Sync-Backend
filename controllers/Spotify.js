const messages = require('../utils/messages');
const format = require('../utils/formatResponse');
const moods = require('../utils/moods');
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
            // res.json(messages.success('Token de Spotify obtenido con éxito', { token: this.token }));
            return;
        } catch (error) {
            res.status(500).json(messages.error('Error al obtener el token de Spotify'));
        }
    }

    getTracks = async (req, res) => {
        await this.getToken(req, res);
        const {mood} = req.query;
        console.log(moods.filter((m) => m.name === mood));
        
        try {
            const genres = moods.filter((m) => m.name === mood)[0];
            const response = await fetch(`https://api.spotify.com/v1/search?q=genre:${genres.genre}&type=track&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const data = await response.json();
            res.json(messages.success('Canciones obtenidas con éxito', { tracks: data.tracks.items }));
        } catch (error) {
            res.status(500).json(messages.error('Error al obtener las canciones de Spotify'));
        }

    }

}

module.exports = new Spotify();
const messages = require('../utils/messages');
const letras = require('../constants/letras');
require('dotenv').config();

class Spotify {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.token = null;
        this.tokenExpiry = null;
    }

    getToken = async (req, res) => {
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
            return;
        } catch (error) {
            res.status(500).json(messages.error('Error al obtener el token de Spotify'));
        }
    }

    getAll = async (req, res) => {
        await this.getToken(req, res);
        const {search} = req.query;
        const letraAleatoria = letras[Math.floor(Math.random() * letras.length)];
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${search} ${letraAleatoria}&type=track,artist,album,playlist&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const data = await response.json();
            res.json(messages.success('Canciones de Spotify obtenidas exitosamente', data));
        } catch (error) {
            res.status(500).json(messages.error('Error al obtener las canciones de Spotify'));
        }
    }
    searchStack = async (req, res, type) => {
        await this.getToken(req, res);
        const { search } = req.query;
        const letraAleatoria = letras[Math.floor(Math.random() * letras.length)];
        
        const messages_map = {
            track: 'Canciones',
            album: 'Álbumes',
            artist: 'Artistas',
            playlist: 'Playlists'
        };
        
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${search} ${letraAleatoria}&type=${type}&limit=10`,{
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            const data = await response.json();
            res.json(messages.success(`${messages_map[type]} obtenidos con éxito`, data));
        } catch (error) {
            res.status(500).json(messages.error(`Error al obtener los ${messages_map[type].toLowerCase()} de Spotify`));
        }
    }
    searchItem = async (req, res, type) => {
        await this.getToken(req, res);
        const { id } = req.query;
        
        const messages_map = {
            tracks: 'Cancion',
            albums: 'Álbum',
            artists: 'Artista',
            playlists: 'Playlist'
        };
        
        try {
            const response = await fetch(`https://api.spotify.com/v1/${type}/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            const data = await response.json();
            res.json(messages.success(`${messages_map[type]} obtenido con éxito`, data));
        } catch (error) {
            res.status(500).json(messages.error(`Error al obtener ${messages_map[type].toLowerCase()} de Spotify`));
        }
    }
    
    getTracks = async (req, res) => {
        await this.searchStack(req, res, 'track');
    }
    getAlbums = async (req, res) => {
        await this.searchStack(req, res, 'album');
    }
    getArtists = async (req, res) => {
        await this.searchStack(req, res, 'artist');
    }
    getPlaylists = async (req, res) => {
        await this.searchStack(req, res, 'playlist');
    }

    getTrack = async (req, res) => {
        await this.searchItem(req, res, 'tracks');
    }
    getAlbum = async (req, res) => {
        await this.searchItem(req, res, 'albums');
    }
    getArtist = async (req, res) => {
        await this.searchItem(req, res, 'artists');
    }
    getPlaylist = async (req, res) => {
        await this.searchItem(req, res, 'playlists');
    }
}

module.exports = new Spotify();
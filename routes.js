const express = require('express');
const Auth = require('./controllers/Auth');
const Email = require('./controllers/Email');
const Spotify = require('./controllers/Spotify');
const { authenticate } = require('./middlewares/AuthMiddleware');

const router = express.Router();

router.get('/spotify/all', Spotify.getAll);
router.get('/spotify/tracks', Spotify.getTracks);
router.get('/spotify/albums', Spotify.getAlbums);
router.get('/spotify/artists', Spotify.getArtists);
router.get('/spotify/playlists', Spotify.getPlaylists);
router.get('/spotify/track', Spotify.getTrack);
router.get('/spotify/album', Spotify.getAlbum);
router.get('/spotify/artist', Spotify.getArtist);
router.get('/spotify/playlist', Spotify.getPlaylist);

router.post('/auth/login', Auth.login);
router.post('/auth/register', Auth.register);
router.post('/auth/logout', authenticate, Auth.logout);
router.post('/auth/forgot-password', Auth.forgotPassword);
router.post('/auth/reset-password', Auth.resetPassword);

router.post('/email/verify-account', Email.verifyAccount);
router.post('/email/send-email-verify', Email.sendEmailVerify);


module.exports = router;
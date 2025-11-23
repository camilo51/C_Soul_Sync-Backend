const express = require('express');
const Auth = require('./controllers/Auth');
const Spotify = require('./controllers/Spotify');

const router = express.Router();

router.get('/spotify/token', Spotify.getToken)
router.get('/spotify/tracks', Spotify.getTracks)

router.get('/auth/login', Auth.login);
router.get('/auth/register', Auth.register);

module.exports = router;
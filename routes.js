const express = require('express');
const Auth = require('./controllers/User');
const Spotify = require('./controllers/Spotify');

const router = express.Router();

router.get('/spotify/token', Spotify.getToken)
router.get('/spotify/tracks', Spotify.getTracks)

router.get('/user/login', Auth.login);
router.post('/user/register', Auth.register);

module.exports = router;
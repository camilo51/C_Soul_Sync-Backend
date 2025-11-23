const express = require('express');
const Auth = require('./controllers/User');

const router = express.Router();

router.get('/user/login', Auth.login);
router.post('/user/register', Auth.register);

module.exports = router;
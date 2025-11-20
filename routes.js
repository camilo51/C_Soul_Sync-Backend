const express = require('express');
const Auth = require('./controllers/Auth');

const router = express.Router();

router.get('/auth/login', Auth.login);
router.get('/auth/register', Auth.register);

module.exports = router;
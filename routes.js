const express = require('express');
const Auth = require('./controllers/Auth');
const { authenticate } = require('./middlewares/AuthMiddleware');


const router = express.Router();

router.get('/auth/login', Auth.login);
router.post('/auth/register', Auth.register);
router.post('/auth/logout', authenticate, Auth.logout);

module.exports = router;
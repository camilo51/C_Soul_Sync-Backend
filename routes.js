const express = require('express');
const Auth = require('./controllers/Auth');
const { authenticate } = require('./middlewares/AuthMiddleware');


const router = express.Router();

router.post('/auth/login', Auth.login);
router.post('/auth/register', Auth.register);
router.post('/auth/logout', authenticate, Auth.logout);
router.post('/auth/forgot-password', Auth.forgotPassword);
router.post('/auth/reset-password', Auth.resetPassword);

module.exports = router;
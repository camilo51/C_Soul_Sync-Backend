const express = require('express');
const Auth = require('./controllers/Auth');
const Email = require('./controllers/Email');
const Spotify = require('./controllers/Spotify');
const { authenticate } = require('./middlewares/AuthMiddleware');

const router = express.Router();

router.get('/spotify/all', Spotify.getAll);
router.get('/spotify/categories', Spotify.getCategories);
router.get('/spotify/:type', Spotify.getStack);

router.post('/auth/login', Auth.login);
router.post('/auth/register', Auth.register);
router.post('/auth/logout', authenticate, Auth.logout);
router.post('/auth/forgot-password', Auth.forgotPassword);
router.post('/auth/reset-password', Auth.resetPassword);
router.put('/auth/update', authenticate, Auth.updateUser);
router.delete('/auth/delete', authenticate, Auth.DeleteUser);

router.post('/email/verify-account', Email.verifyAccount);
router.post('/email/send-email-verify', Email.sendEmailVerify);


module.exports = router;
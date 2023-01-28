// Déclaration package
const express = require('express');
const router = express.Router();

const rateLimit = require('express-rate-limit'); 
const userCtrl = require('../controllers/user');

// Limitateur de demande aux API publiques
const passLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, 
    max: 3 
  });

// Routes pour s'inscrire ou se connecter 
router.post('/signup', userCtrl.signup);
router.post('/login',passLimiter, userCtrl.login);


module.exports = router;
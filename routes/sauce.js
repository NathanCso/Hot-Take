// Déclaration des constantes 
const express = require('express');
const router = express.Router();
const controllersSauce = require('../controllers/sauce');
const auth = require('../middleware/auth'); 
const multer = require('../middleware/multer-config'); 

// Routes pour les likes et les options de création suppression et la modification 
router.post('/', auth, multer, controllersSauce.createSauce);
router.put('/:id', auth, multer, controllersSauce.modifySauce);
router.delete('/:id', auth, controllersSauce.deleteSauce);
router.post('/:id/like', auth, controllersSauce.likeSauce);

router.get('/', auth, controllersSauce.getAllSauces);
router.get('/:id', auth, controllersSauce.getOneSauce);

module.exports = router; 
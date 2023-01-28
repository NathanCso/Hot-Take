// Déclaration des constantes et require
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');
const Sauce = require("./models/Sauce");

// Connection a Moongoose
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://casciabn:r4lUv59iCtphtwqM@cluster0.ngonmk5.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Headers Cors 
app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Récupération des requetes en format Json
app.use(bodyParser.json()); 

// Mongo Sanitize
app.use(mongoSanitize()); 

// Helmet pour la protection de données 
app.use(helmet()); 

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Routes Principales 
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
    

module.exports = app;
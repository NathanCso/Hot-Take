// Déclaration Jsonwebtoken
const jwt = require('jsonwebtoken');

// Middleware pour l'authentification 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
        const userId = decodedToken.userId;        
        if (req.body.userId && req.body.userId !== userId) { 
            throw 'Utilisateur inconnu';
        } else {
            next();
        }
    } catch(error){
        res.status(401).json({ error: new Error('Invalid Request!')});
    }
};
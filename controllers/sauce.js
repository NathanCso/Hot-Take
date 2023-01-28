// Déclaration des constantes de récupération
const fs = require('fs'); 
const Sauce = require('../models/Sauce'); 

// Création de sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const newSauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,        
    });
    newSauce.save()  
    .then( () => res.status(201).json({ message: 'Sauce enregistrée'}))
    .catch( error => res.status(400).json({ error }))
    console.log(newSauce);
};

// Modification de sauce 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(()=> res.status(400).json({ error}))
};

// Suppresion de Sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) 
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => { 
    Sauce.deleteOne({_id: req.params.id}) 
    .then(()=> res.status(200).json({ message: 'Sauce supprimée'}))
    .catch(error => res.status(400).json({ error}))
    });
})
};

// Exportation d'une sauce et de toutes les sauces 
exports.getAllSauces = (req, res, next) => { 
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => {  
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};


// Option de like et de dislikes
exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) { 
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous avez liker cette sauce' }))
        .catch( error => res.status(400).json({ error}))

    } else if(like === -1) { 
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous avez disliké cette sauce ' }))
        .catch( error => res.status(400).json({ error}))

 // Condition d'annulation 
    } else {    
        
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                .catch( error => res.status(400).json({ error}))
                }
                
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                .catch( error => res.status(400).json({ error}))
                }           
        })
        .catch( error => res.status(400).json({ error}))             
    }   
};

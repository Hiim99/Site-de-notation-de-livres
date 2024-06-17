const fs = require('fs');
const sharp = require('sharp');
const Book = require('../models/book');

//Ajout d'un livre 
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const filePath = req.file.path;
    const compressedFilePath = `images/compressed-${req.file.filename}`;

    sharp(filePath)
        .resize(800) 
        .toFormat('jpeg')
        .jpeg({ quality: 80 }) 
        .toFile(compressedFilePath, (err, info) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            const book = new Book({
                ...bookObject,
                userId: req.auth.userId,
                imageUrl: `${req.protocol}://${req.get('host')}/${compressedFilePath}`
            });
            book.save()
                .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
                .catch(error => { res.status(400).json({ error }) });
        });
};
// Affichage des livres dans la page d'acceuil 
exports.getBooks = (req, res, next) => {
    Book.find()
    .then(books => {
        res.status(200).json(books);
    })
    .catch(error => { 
        res.status(400).json({ error });
    });
};

//Modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

// Récuperer un livre (page de détails) 
exports.getOneBook = (req, res, next) => {
        Book.findOne({ _id: req.params.id })
          .then(book => res.status(200).json(book))
          .catch(error => res.status(404).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('images')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
                res.status(500).json({ error });
        });
};
// Donner une note à un livre et display the la nouvelle note moyenne 
exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;
    const bookId = req.params.id;
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'Grade must be between 0 and 5.' });
    }
    Book.findById(bookId)
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            const existingRating = book.ratings.find(rating => rating.userId === userId);
            if (existingRating) {
                return res.status(400).json({ message: 'User has already rated this book.' });
            }
            const newRatings = [...book.ratings, { userId: userId, grade: rating }];
            const totalRatings = newRatings.length;
            const totalGrade = newRatings.reduce((sum, rating) => sum + rating.grade, 0);
            const newAverageRating = Math.round(totalGrade / totalRatings); // Round to the nearest integer
            book.updateOne({ ratings: newRatings, averageRating: newAverageRating })
                .then(() => res.status(200).json({ _id: book._id, userId: book.userId, title: book.title, author: book.author, imageUrl: book.imageUrl, year: book.year, genre: book.genre, ratings: newRatings, averageRating: newAverageRating }))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// les 3 livres les mieux notés 
exports.getBestRatedBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};
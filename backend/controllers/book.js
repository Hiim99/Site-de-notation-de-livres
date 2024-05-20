const Book = require('../models/book');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getBooks = (req, res, next) => {
    console.log('getBooks called');
    Book.find()
    .then(books => {
        res.status(200).json(books);
    })
    .catch(error => { 
        res.status(400).json({ error });
    });
};
exports.modifyBook = (req, res, next) => {
    //to doo dodoododo  
};
exports.getOneBook = (req, res, next) => {
    //to doo dodoododo  
};exports.deleteBook = (req, res, next) => {
    //to doo dodoododo  
};
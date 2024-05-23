const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multerConfig'); // Positionner après auth sinon on pourra rajouter des photos même si on est pas connecté
const router = express.Router();

const bookController = require('../controllers/book');
// get books
router.get('/', bookController.getBooks);
// get one book
router.get('/:id', bookController.getOneBook);
// create book
router.post('/', auth, multer.single('image'), bookController.createBook);
//modify book 
router.put('/:id', auth, multer.single('image'), bookController.modifyBook);
//delete a book
router.delete('/:id', auth, bookController.deleteBook);
//Noter un livre
router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;
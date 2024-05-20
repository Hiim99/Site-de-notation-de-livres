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
router.post('/', auth, multer, bookController.createBook);
//modify book 
router.put('/:id', auth, multer, bookController.modifyBook);
//delete a book
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
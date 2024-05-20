const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const bookController = require('../controllers/book');
// get books
router.get('/', auth, bookController.getBooks);
// get one book
router.get('/:id', auth, bookController.getOneBook);
// create book
router.post('/', auth, bookController.createBook);
//modify book 
router.put('/:id', auth, bookController.modifyBook);
//delete a book
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
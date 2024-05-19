const express = require('express');
const router = express.Router();

const bookController = require('../controllers/book');
// get books
router.get('/', bookController.getBooks);
// get one book
router.get('/:id', bookController.getOneBook);
// create book
router.post('/', bookController.createBook);
//modify book 
router.put('/:id', bookController.modifyBook);
//delete a book
router.delete('/:id', bookController.deleteBook);

module.exports = router;
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/books', bookController.getBooks);
router.post('/books', authenticateToken, authorizeAdmin, upload.single('coverImage'), bookController.createBook);
router.delete('/books/:id', authenticateToken, authorizeAdmin, bookController.deleteBook);
router.put('/books/:id', authenticateToken, authorizeAdmin, upload.single('coverImage'), bookController.updateBook);

module.exports = router;

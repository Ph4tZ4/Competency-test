const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.post('/borrow', authenticateToken, transactionController.borrowBook);
router.post('/return', authenticateToken, transactionController.returnBook);
router.get('/history/:user_id', authenticateToken, transactionController.getHistory);
router.get('/admin/borrowed-books', authenticateToken, authorizeAdmin, transactionController.getBorrowedBooks);

module.exports = router;

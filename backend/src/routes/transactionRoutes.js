const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.post('/borrow', authenticateToken, transactionController.borrowBook);
router.post('/return', authenticateToken, transactionController.returnBook);
router.get('/history/:user_id', authenticateToken, transactionController.getHistory);
// Dashboard for Admin
// Dashboard for Admin
router.get('/admin/dashboard', authenticateToken, authorizeAdmin, transactionController.getBorrowedBooks);
router.get('/admin/borrowed-books', authenticateToken, authorizeAdmin, transactionController.getBorrowedBooks);
router.get('/admin/pending-requests', authenticateToken, authorizeAdmin, transactionController.getPendingTransactions);
router.put('/admin/approve/:id', authenticateToken, authorizeAdmin, transactionController.approveTransaction);
router.put('/admin/reject/:id', authenticateToken, authorizeAdmin, transactionController.rejectTransaction);

module.exports = router;

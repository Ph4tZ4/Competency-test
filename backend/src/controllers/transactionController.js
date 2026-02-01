const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

const borrowBook = async (req, res, next) => {
    const { user_id, book_id } = req.body;

    try {
        const book = await Book.findById(book_id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (book.quantity < 1) return res.status(400).json({ error: 'Book out of stock' });

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const transaction = new Transaction({
            user_id,
            book_id,
            due_date: dueDate,
            status: 'borrowed'
        });
        await transaction.save();

        book.quantity -= 1;
        await book.save();

        res.status(201).json({ message: 'Borrow successful', transaction });
    } catch (err) {
        next(err);
    }
};

const returnBook = async (req, res, next) => {
    const { transaction_id } = req.body;

    try {
        const transaction = await Transaction.findById(transaction_id);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        if (transaction.status === 'returned') return res.status(400).json({ error: 'Already returned' });

        transaction.status = 'returned';
        transaction.return_date = new Date();
        await transaction.save();

        const book = await Book.findById(transaction.book_id);
        if (book) {
            book.quantity += 1;
            await book.save();
        }

        res.json({ message: 'Return successful', transaction });
    } catch (err) {
        next(err);
    }
};

const getHistory = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const history = await Transaction.find({ user_id })
            .populate('book_id', 'title author')
            .sort({ createdAt: -1 });

        res.json(history);
    } catch (err) {
        next(err);
    }
};

const getBorrowedBooks = async (req, res, next) => {
    try {
        const borrowedBooks = await Transaction.find({ status: 'borrowed' })
            .populate('user_id', 'username')
            .populate('book_id', 'title author');

        res.json(borrowedBooks);
    } catch (err) {
        next(err);
    }
};

module.exports = { borrowBook, returnBook, getHistory, getBorrowedBooks };

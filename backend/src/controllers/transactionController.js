const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

const borrowBook = async (req, res, next) => {
    const { user_id, book_id } = req.body;

    try {
        const book = await Book.findById(book_id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (book.quantity < 1) {
            console.warn(`Book ${book_id} out of stock. Qty: ${book.quantity}`);
            return res.status(400).json({ error: 'Book out of stock' });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const transaction = new Transaction({
            user_id,
            book_id,
            due_date: dueDate,
            status: 'pending'
        });
        console.log('Creating transaction:', transaction);
        await transaction.save();

        book.quantity -= 1;
        await book.save();

        res.status(201).json({ message: 'Borrow request submitted, waiting for approval', transaction });
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
        // Fetch both borrowed and pending to show full activity
        const borrowedBooks = await Transaction.find({
            status: { $in: ['borrowed', 'pending', 'rejected', 'returned'] }
        })
            .populate('user_id', 'username')
            .populate('book_id', 'title author')
            .sort({ createdAt: -1 });

        res.json(borrowedBooks);
    } catch (err) {
        next(err);
    }
};

const getPendingTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ status: 'pending' })
            .populate('user_id', 'username')
            .populate('book_id', 'title author');
        res.json(transactions);
    } catch (err) {
        next(err);
    }
};

const approveTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);

        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        if (transaction.status !== 'pending') return res.status(400).json({ error: 'Transaction is not pending' });

        transaction.status = 'borrowed';
        await transaction.save();

        res.json({ message: 'Transaction approved', transaction });
    } catch (err) {
        next(err);
    }
};

const rejectTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);

        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        if (transaction.status !== 'pending') return res.status(400).json({ error: 'Transaction is not pending' });

        transaction.status = 'rejected';
        await transaction.save();

        // Refund stock since we deducted it when request was made
        const book = await Book.findById(transaction.book_id);
        if (book) {
            book.quantity += 1;
            await book.save();
        }

        res.json({ message: 'Transaction rejected', transaction });
    } catch (err) {
        next(err);
    }
};

module.exports = { borrowBook, returnBook, getHistory, getBorrowedBooks, getPendingTransactions, approveTransaction, rejectTransaction };

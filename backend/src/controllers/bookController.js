const Book = require('../models/Book');

const getBooks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        const totalItems = await Book.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        const books = await Book.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const booksWithStatus = books.map(book => ({
            ...book.toObject(),
            status_text: book.quantity > 0 ? 'Available' : 'Out of Stock'
        }));

        res.json({
            data: booksWithStatus,
            meta: {
                total_items: totalItems,
                total_pages: totalPages,
                current_page: page,
                items_per_page: limit
            }
        });
    } catch (err) {
        next(err);
    }
};

const createBook = async (req, res, next) => {
    try {
        const { title, author, quantity } = req.body;

        let coverImage = req.body.coverImage || '';
        if (req.file) {
            coverImage = `/uploads/${req.file.filename}`;
        }

        const book = new Book({
            title,
            author,
            quantity,
            coverImage
        });

        await book.save();
        res.status(201).json(book);
    } catch (err) {
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        next(err);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, author, quantity } = req.body;

        let updateData = {
            title,
            author,
            quantity
        };

        if (req.file) {
            updateData.coverImage = `/uploads/${req.file.filename}`;
        } else if (req.body.coverImage) {
            updateData.coverImage = req.body.coverImage;
        }

        const book = await Book.findByIdAndUpdate(id, updateData, { new: true });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (err) {
        next(err);
    }
};

module.exports = { getBooks, createBook, deleteBook, updateBook };

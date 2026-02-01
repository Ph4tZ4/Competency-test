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

        let coverImage = '';
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

module.exports = { getBooks, createBook };

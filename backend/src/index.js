const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// เชื่อมต่อ Database
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Competency-test-db';

mongoose.connect(mongoUri)
    .then(() => console.log('✅ Connected to MongoDB successfully'))
    .catch(err => console.error('❌ Could not connect to MongoDB:', err));

// Mount Routes
app.use(authRoutes);
app.use(bookRoutes);
app.use(transactionRoutes);

// Error Middleware (Should be last)
app.use(errorHandler);

// เริ่ม Server
const PORT = 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

module.exports = app;
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    coverImage: {
        type: String, // เก็บ URL หรือ path ของรูปภาพ
        required: false // ไม่บังคับว่าต้องมีรูป
    }
    // หมายเหตุ: สถานะ "ว่าง/ถูกยืม" (2.2.7) เราจะใช้ Logic เช็คจาก quantity ตอนดึงข้อมูล
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

let userId;
let userToken;
let adminToken;
let bookId;
let transactionId;

beforeAll(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Library API Integration Tests', () => {

    // --- Group 1: User Authentication ---

    it('(1) POST /register - Should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'password123',
                role: 'member'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User registered successfully');
    });

    it('(2) POST /register - Should fail for duplicate username', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('(3) POST /login - Should login successfully', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');

        userToken = res.body.token;
        userId = res.body.user._id;
    });

    it('(4) POST /login - Should fail with wrong password', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(401);
    });

    // --- Group 2: Admin Setup (Required to create books) ---

    it('(5) POST /register - Should register a new admin', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'adminuser',
                password: 'adminpassword',
                role: 'admin'
            });
        expect(res.statusCode).toEqual(201);
    });

    it('(6) POST /login - Should login as admin', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                username: 'adminuser',
                password: 'adminpassword'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.user.role).toEqual('admin');
        adminToken = res.body.token;
    });

    // --- Group 3: Book Management (Requires Admin) ---

    it('(7) POST /books - Should create a new book (Admin)', async () => {
        const res = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Integration Testing 101',
                author: 'QA Team',
                quantity: 1
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        bookId = res.body._id;
    });

    it('(8) GET /books - Should return all books', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toEqual(200);
        // Response structure is { data: [...], meta: ... }
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    // --- Group 4: Borrowing System (Requires User) ---

    it('(9) POST /borrow - Should borrow a book', async () => {
        const res = await request(app)
            .post('/borrow')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                user_id: userId,
                book_id: bookId
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toContain('waiting for approval');
        transactionId = res.body.transaction._id;
    });

    it('(10) POST /borrow - Should fail when out of stock', async () => {
        // Book had quantity 1, now 0 (deducted in pending).
        const res = await request(app)
            .post('/borrow')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                user_id: userId,
                book_id: bookId
            });
        expect(res.statusCode).toEqual(400); // Should still be out of stock
    });

    it('(10.5) PUT /admin/approve/:id - Should approve transaction', async () => {
        const res = await request(app)
            .put(`/admin/approve/${transactionId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.transaction.status).toEqual('borrowed');
    });

    it('(11) POST /return - Should return a book', async () => {
        const res = await request(app)
            .post('/return')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                transaction_id: transactionId
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.transaction.status).toEqual('returned');
    });

    it('(12) POST /return - Should fail if already returned', async () => {
        const res = await request(app)
            .post('/return')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                transaction_id: transactionId
            });
        expect(res.statusCode).toEqual(400);
    });

    // --- Group 5: Admin Features (Dashboard/Users) ---

    it('(13) GET /admin/dashboard - Should return borrowed books (Admin)', async () => {
        const res = await request(app)
            .get('/admin/dashboard')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        // Even if empty now, should be array
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('(14) GET /admin/users - Should return all users (Admin)', async () => {
        const res = await request(app)
            .get('/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('(15) GET /admin/dashboard - Should fail for Member', async () => {
        const res = await request(app)
            .get('/admin/dashboard')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
    });
});
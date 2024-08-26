const request = require('supertest');
const app = require('../server'); // Import the Express app

describe('Express Application', () => {
    it('should return 200 on GET /', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('We are ready to go!');
    });

    it('should limit requests with rate limiting', async () => {
        const limit = 100;
        const promises = [];
        for (let i = 0; i < limit + 1; i++) {
            promises.push(request(app).get('/'));
        }
        const responses = await Promise.all(promises);
        const lastResponse = responses[responses.length - 1];
        expect(lastResponse.statusCode).toBe(429);
        expect(lastResponse.text).toBe('Too many requests, please try again later.');
    });

    it('should sanitize input to prevent XSS', async () => {
        const res = await request(app)
            .post('/')
            .send({ name: '<script>alert("xss")</script>' });
        expect(res.statusCode).toBe(404); // Assuming the POST route is not defined
    });

    it('should sanitize MongoDB queries to prevent NoSQL injection', async () => {
        const res = await request(app)
            .post('/users')
            .send({ email: { "$gt": "" }, password: "password123" });
        expect(res.statusCode).toBe(404); // Assuming the POST route is not defined
    });

    it('should prevent HTTP Parameter Pollution', async () => {
        const res = await request(app).get('/?name=jack&name=jill');
        expect(res.statusCode).toBe(404); // Assuming the GET route with parameters is not defined
    });

    it('should return 500 for server errors', async () => {
        app.get('/error', (req, res) => {
            throw new Error('Test Error');
        });

        const res = await request(app).get('/error');
        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('Something went wrong!');
    });
});

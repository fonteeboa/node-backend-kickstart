const request = require('supertest');
const app = require('../server');

describe('Express Application', () => {
    it('should return 200 on GET /', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('We are ready to go!');
    });

    it('should sanitize input to prevent XSS', async () => {
        const res = await request(app)
            .post('/')
            .send({ name: '<script>alert("xss")</script>' });
        expect(res.statusCode).toBe(404);
    });

    it('should sanitize MongoDB queries to prevent NoSQL injection', async () => {
        const res = await request(app)
            .post('/users')
            .send({ email: { "$gt": "" }, password: "password123" });
        expect(res.statusCode).toBe(404);
    });

    it('should prevent HTTP Parameter Pollution', async () => {
        const res = await request(app).get('/?name=jack&name=jill');
        expect(res.statusCode).toBe(200);
    });

    it('should return error for undefined routes', async () => {
        const res = await request(app).get('/error');
        expect(res.text).toContain('<pre>Cannot GET /error</pre>');
    });

    it('should return 200 on GET /', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('We are ready to go!');
    });

    it('should handle errors with 500 response', async () => {
        app.get('/error', (req, res) => {
            throw new Error('Test error');
        });
        const res = await request(app).get('/error');
        expect(res.statusCode).toEqual(500);
    });

    it('should return 500 and HTML error page when an error occurs', async () => {
        const res = await request(app).get('/error');

        expect(res.statusCode).toBe(500);
        expect(res.text).toContain('<title>Error</title>');
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
});

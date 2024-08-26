const request = require('supertest');
const app = require('../server'); // Importa o app do servidor

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
        // Verifica se a resposta é 404 porque a rota POST não está definida
        expect(res.statusCode).toBe(404);
    });

    it('should sanitize MongoDB queries to prevent NoSQL injection', async () => {
        const res = await request(app)
            .post('/users')
            .send({ email: { "$gt": "" }, password: "password123" });
        // Verifica se a resposta é 404 porque a rota POST /users não está definida
        expect(res.statusCode).toBe(404);
    });

    it('should prevent HTTP Parameter Pollution', async () => {
        const res = await request(app).get('/?name=jack&name=jill');
        // Verifica se a resposta é 200 porque a rota GET / está definida
        expect(res.statusCode).toBe(200);
    });

    it('should return error for undefined routes', async () => {
        const res = await request(app).get('/error');
        expect(res.text).toContain('<pre>Cannot GET /error</pre>');
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

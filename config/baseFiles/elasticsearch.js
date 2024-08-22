const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');
dotenv.config();

const { ELASTICSEARCH_HOST, ELASTICSEARCH_PORT, ELASTICSEARCH_USER, ELASTICSEARCH_PASSWORD } = process.env;

const client = new Client({
    node: `http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}`,
    auth: {
        username: ELASTICSEARCH_USER,
        password: ELASTICSEARCH_PASSWORD
    }
});

export default client.ping()
    .then(() => {
        console.log('Connected to Elasticsearch');
        return { status: 'success', connection: client };
    })
    .catch(err => {
        return { status: 'error', error: { code: 5002, message: 'Elasticsearch connection failed', details: err } };
    });

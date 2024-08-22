const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { MONGO_DB, MONGO_URI } = process.env;

export default mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: MONGO_DB,
})
    .then(connection => {
        console.log('Connected to MongoDB');
        return { status: 'success', connection };
    })
    .catch(err => {
        return { status: 'error', error: { code: 5002, message: 'Database connection failed', details: err } };
    });

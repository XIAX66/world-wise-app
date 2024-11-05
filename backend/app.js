const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cityRouter = require('./routes/cityRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/v1/cities', cityRouter);

module.exports = app;

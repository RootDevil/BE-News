const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api.router');
const { handleCustomErrors, handlePSQLErrors, handleServerErrors } = require('./errors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
    res.status(404).send({ message: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
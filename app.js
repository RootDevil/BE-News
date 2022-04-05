const express = require('express');
const cors = require('cors');
const { deleteCommentById } = require('./controllers/comments.controller');
const { getTopics } = require('./controllers/topics.controller');
const { getUsers } = require('./controllers/users.controller');
const { handleCustomErrors, handlePSQLErrors, handleServerErrors } = require('./errors');
const apiRouter = require('./routes/api.router');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
    res.status(404).send({ message: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
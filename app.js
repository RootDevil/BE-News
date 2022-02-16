const express = require('express');
const { getArticleById, patchArticleById, getArticles } = require('./controllers/articles.controller');
const { getCommentsByArticleId, postCommentByArticleId } = require('./controllers/comments.controller');
const { getTopics } = require('./controllers/topics.controller');
const { getUsers } = require('./controllers/users.controller');
const { handleCustomErrors, handlePSQLErrors, handleServerErrors } = require('./errors');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/users', getUsers);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.all('/*', (req, res) => {
    res.status(404).send({ message: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
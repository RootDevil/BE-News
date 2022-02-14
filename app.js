const express = require('express');
const { getArticleById } = require('./controllers/articles.controller');
const { getTopics } = require('./controllers/topics.controller');
const { handleCustomErrors, handlePSQLErrors, handleServerErrors } = require('./errors');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.all('/*', (req, res) => {
    res.status(404).send({ message: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
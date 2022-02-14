const express = require('express');
const { getArticleById } = require('./controllers/articles.controller');
const { getTopics } = require('./controllers/topics.controller');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.use((err, req, res, next) => {
    res.status(err.status).send({ message: err.message });
})

app.all('/*', (req, res) => {
    res.status(404).send({ message: "Path not found" });
})

module.exports = app;
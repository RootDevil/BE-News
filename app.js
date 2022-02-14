const express = require('express');
const { getArticleById } = require('./controllers/articles.controller');
const { getTopics } = require('./controllers/topics.controller');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      }
    else next(err);
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: "Bad request" });
    }
})

app.all('/*', (req, res) => {
    res.status(404).send({ message: "Path not found" });
})

module.exports = app;
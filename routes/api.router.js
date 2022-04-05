const apiRouter = require('express').Router();
const { readFile } = require('fs/promises');
const articleRouter = require('./articles.router');

apiRouter.use('/articles', articleRouter);

apiRouter.get('/', async (req, res) => {
    const endpoints = JSON.parse(await readFile('./endpoints.json', 'utf-8'));
    res.status(200).send({ endpoints });
});

module.exports = apiRouter;
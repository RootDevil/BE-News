const apiRouter = require('express').Router();
const { readFile } = require('fs/promises');
const articleRouter = require('./articles.router');
const topicRouter = require('./topics.router');

apiRouter.use('/articles', articleRouter);
apiRouter.use('/topics', topicRouter);

apiRouter.get('/', async (req, res) => {
    const endpoints = JSON.parse(await readFile('./endpoints.json', 'utf-8'));
    res.status(200).send({ endpoints });
});

module.exports = apiRouter;
const apiRouter = require('express').Router();
const { readFile } = require('fs/promises');
const articleRouter = require('./articles.router');
const topicRouter = require('./topics.router');
const userRouter = require('./users.router');

apiRouter.use('/articles', articleRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);

apiRouter.get('/', async (req, res) => {
    const endpoints = JSON.parse(await readFile('./endpoints.json', 'utf-8'));
    res.status(200).send({ endpoints });
});

module.exports = apiRouter;
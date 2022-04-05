const apiRouter = require('express').Router();
const { readFile } = require('fs/promises');

apiRouter.get('/', async (req, res) => {
    const endpoints = JSON.parse(await readFile('./endpoints.json', 'utf-8'));
    res.status(200).send({ endpoints });
});

module.exports = apiRouter;
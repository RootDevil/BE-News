const articleRouter = require('express').Router();
const { getArticles, getArticleById, patchArticleById, postArticle } = require('../controllers/articles.controller');
const { getCommentsByArticleId, postCommentByArticleId } = require('../controllers/comments.controller');

articleRouter.route('/')
    .get(getArticles)
    .post(postArticle);
articleRouter.route('/:article_id') 
    .get(getArticleById)
    .patch(patchArticleById);
articleRouter.route('/:article_id/comments') 
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId);

module.exports = articleRouter;
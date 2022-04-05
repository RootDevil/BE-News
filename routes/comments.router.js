const commentRouter = require('express').Router();
const { deleteCommentById } = require('../controllers/comments.controller');

commentRouter.delete('/:comment_id', deleteCommentById);

module.exports = commentRouter;
const { selectCommentsByArticleId, insertCommentByArticleId, removeCommentById } = require("../models/comments.model")

exports.getCommentsByArticleId = async (req, res, next) => {
    try {
        const comments = await selectCommentsByArticleId(req.params.article_id);
        res.status(200).send({ comments });
    }
    catch(err) {
        next(err);
    }
}

exports.postCommentByArticleId = async (req, res, next) => {
    try {
        const { params: { article_id } } = req;
        const comment = await insertCommentByArticleId(article_id, req.body);
        res.status(200).send({ comment });
    }
    catch(err) {
        next(err);
    }
}

exports.deleteCommentById = async (req, res, next) => {
    try {
        const { params: { comment_id } } = req;
        const comment = await removeCommentById(comment_id);
        res.status(201).send({ comment });
    }
    catch(err) {
        next(err);
    }
}
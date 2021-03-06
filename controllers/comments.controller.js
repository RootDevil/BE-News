const { selectCommentsByArticleId, insertCommentByArticleId, removeCommentById, updateCommentById } = require("../models/comments.model")

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
        await removeCommentById(comment_id);
        res.status(204).send();
    }
    catch(err) {
        next(err);
    }
}

exports.patchCommentById = async (req, res, next) => {
    try {
        const { params: { comment_id: commentId } } = req;
        const { body: { inc_votes: incVotes }} = req;
        const comment = await updateCommentById(commentId, incVotes);
        res.status(200).send({ comment });
    }
    catch(err) {
        next(err);
    }
}
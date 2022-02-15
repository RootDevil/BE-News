const { selectCommentsByArticleId } = require("../models/comments.model")

exports.getCommentsByArticleId = async (req, res, next) => {
    try {
        const comments = await selectCommentsByArticleId(req.params.article_id);
        res.status(200).send({ comments });
    }
    catch(err) {
        next(err);
    }
}
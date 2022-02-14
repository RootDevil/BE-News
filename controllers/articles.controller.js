const { selectArticleById } = require("../models/articles.model")

exports.getArticleById = async (req, res) => {
    const article = await selectArticleById(req.params.article_id);
    res.status(200).send({ article });
}
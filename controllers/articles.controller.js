const { selectArticleById, updateArticleById, selectArticles, addArticle } = require("../models/articles.model")

exports.getArticleById = async (req, res, next) => {
    try {
        const article = await selectArticleById(req.params.article_id);
        res.status(200).send({ article });
    }
    catch(err) {
        next(err);
    }
}

exports.patchArticleById = async (req, res, next) => {
    try {
        const article = await updateArticleById(req.params.article_id, req.body)
        res.status(200).send({ article });
    }
    catch(err) {
        next(err);
    }
}

exports.getArticles = async (req, res, next) => {
    try {
        const articles = await selectArticles(req.query);
        res.status(200).send({ articles });
    }
    catch(err) {
        next(err);
    }
}

exports.postArticle = async (req, res, next) => {
    try {
        const article = await addArticle(req.body);
        res.status(200).send({ article });
    }
    catch(err) {
        next(err);
    }
}
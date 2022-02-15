const db = require('../db/connection');

exports.selectArticleById = async (articleId) => {
    const article = await db.query(`
        SELECT * FROM articles WHERE article_id = $1;
    `, [articleId]);

    if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Resource does not exist"
        })
    }

    return article.rows[0];
}

exports.updateArticleById = async (articleId, reqBody) => {
    const { inc_votes } = reqBody;
    const article = await db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
    `, [inc_votes, articleId]);

    return article.rows[0];
}

exports.selectArticles = async () => {
    const articles = await db.query(`
        SELECT * FROM articles;
    `)

    return articles.rows;
}
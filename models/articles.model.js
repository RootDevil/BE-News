const db = require('../db/connection');

exports.selectArticleById = async (articleId) => {
    const article = await db.query(`
        SELECT * FROM articles WHERE article_id = $1
    `, [articleId]);

    return article.rows[0];
}
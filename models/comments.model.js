const db = require('../db/connection');

exports.selectCommentsByArticleId = async (articleId) => {
    const comments = await db.query(`
        SELECT * FROM comments
        JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1;
    `, [articleId]);

    return comments.rows;
}
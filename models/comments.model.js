const db = require('../db/connection');
const { checkResourceExists } = require('../utils/utils');

exports.selectCommentsByArticleId = async (articleId) => {
    await checkResourceExists('articles', 'article_id', articleId);

    const comments = await db.query(`
        SELECT * FROM comments
        JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1;
    `, [articleId]);

    return comments.rows;
}
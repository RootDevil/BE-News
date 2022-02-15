const db = require('../db/connection');

const checkArticleExists = async (articleId) => {
    const articles = await db.query(
        'SELECT * FROM articles WHERE article_id = $1;',
        [articleId]
      );
    
      if (articles.rows.length === 0) {
        return Promise.reject({ 
            status: 404, 
            message: "Resource does not exist" 
        });
      }
}

exports.selectCommentsByArticleId = async (articleId) => {
    await checkArticleExists(articleId);

    const comments = await db.query(`
        SELECT * FROM comments
        JOIN articles ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1;
    `, [articleId]);

    return comments.rows;
}
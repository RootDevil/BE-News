const db = require('../db/connection');

exports.selectArticleById = async (articleId) => {
    const article = await db.query(`
        SELECT * FROM articles WHERE article_id = $1
    `, [articleId]);

    if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Resource does not exist"
        })
      }

    return article.rows[0];
}
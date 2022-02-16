const db = require('../db/connection');
const { checkResourceExists } = require('../utils/utils');

exports.selectArticleById = async (articleId) => {
    await checkResourceExists('articles', 'article_id', articleId);
    
    const article = await db.query(`
    SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id  WHERE articles.article_id = $1 
    GROUP BY articles.article_id;
    `, [articleId]);

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
        SELECT * FROM articles
        ORDER BY created_at DESC;
    `)

    return articles.rows;
}
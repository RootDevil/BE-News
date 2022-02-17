const db = require('../db/connection');
const { checkResourceExists, checkValidQuery } = require('../utils/utils');

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

exports.selectArticles = async (query) => {
    const validKeys = ['sort_by', 'order', 'topic'];
    await checkValidQuery(query, validKeys);

    const { sort_by, order, topic } = query;
    let queryValues = [];

    let queryStr = `
        SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
    `
    if (topic) {
        queryValues.push(topic);
        queryStr += `WHERE topic = $1`;
    } 
    queryStr += `
        GROUP BY articles.article_id
        ORDER BY
    `
    if (sort_by) queryStr += `${sort_by}`;
    else queryStr += ` created_at`;
    if (order) queryStr += ` ${order};`;
    else queryStr += ` DESC`;
    const articles = await db.query(queryStr, queryValues);

    return articles.rows;
}
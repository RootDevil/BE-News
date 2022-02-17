const db = require('../db/connection');
const { checkResourceExists } = require('../utils/utils');

exports.selectCommentsByArticleId = async (articleId) => {
    await checkResourceExists('articles', 'article_id', articleId);

    const comments = await db.query(`
        SELECT * FROM comments
        WHERE article_id = $1;
    `, [articleId]);

    return comments.rows;
}

exports.insertCommentByArticleId = async (articleId, newComment) => {
    const { username, body } = newComment;
    const comment = await db.query(`
        INSERT INTO comments
            (body, author, article_id)
        VALUES
            ($1, $2, $3)
        RETURNING *;
    `, [body, username, articleId]);

    return comment.rows[0];
}

exports.removeCommentById = async (commentId) => {
    const comment = await db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
    `, [commentId]);

    return comment.rows[0];
}
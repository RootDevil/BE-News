const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');
const { convertTimestampToDate } = require('../db/helpers/utils');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('app', () => {
    describe('Endpoint error', () => {
        test('status:404 - responds with "Path not found"', () => {
            return request(app)
                .get('/api/not-a-path')
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Path not found"
                    });
                })
        });
    });
    describe('GET /api', () => {
        test('status:200 - responds with JSON of all available endpoints', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body: { endpoints } }) => {
                    expect(endpoints).toEqual(
                        expect.objectContaining({
                            "GET /api": expect.any(Object),
                            "GET /api/topics": expect.any(Object),
                            "GET /api/articles": expect.any(Object),
                            "GET /api/articles/:article_id": expect.any(Object),
                            "GET /api/users": expect.any(Object),
                            "GET /api/articles/:article_id/comments": expect.any(Object),
                            "PATCH /api/articles/:article_id": expect.any(Object),
                            "POST /api/articles/:article_id/comments": expect.any(Object),
                            "DELETE /api/articles/:article_id/comments": expect.any(Object),
                        })
                    )
                })
        });
    });
    describe('GET /api/topics', () => {
        test('status:200 - responds with an array of topic objects', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics).toBeInstanceOf(Array);
                    expect(topics).toHaveLength(3);
                    topics.forEach(topic => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String)
                            })
                        )
                    })
                })
        });
    })
    describe('GET /api/articles/:article_id', () => {
        test('status:200 - responds with article object', () => {
            return request(app)
                .get('/api/articles/3')
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: 3,
                            title: "Eight pug gifs that remind me of mitch",
                            topic: "mitch",
                            author: "icellusedkars",
                            body: "some gifs",
                            created_at: expect.any(String),
                            votes: 0
                        })
                    )
                })
        });
        test('status:200 - responds with object containing comment count', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            comment_count: 11
                        })
                    )
                })
        });
        test('status:200 - responds with object containing comment count when article has no comments', () => {
            return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            comment_count: 0
                        })
                    )
                })
        });
        test('status:404 - responds with "Resource does not exist"', () => {
            return request(app)
                .get('/api/articles/9999999')
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Resource does not exist"
                    });
                })
        });
        test('status:400 - responds with "Bad request"', () => {
            return request(app)
                .get('/api/articles/not_an_article_id')
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
    });
    describe('PATCH /api/articles/:article_id', () => {
        test('status:200 - responds with article object with incremented votes when given positive value', () => {
            return request(app)
                .patch('/api/articles/3')
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual({
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "some gifs",
                        created_at: expect.any(String),
                        votes: 1
                    })
                })
        });
        test('status:200 - responds with article object with decremented votes when given negative value', () => {
            return request(app)
                .patch('/api/articles/3')
                .send({ inc_votes: -5 })
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual({
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "some gifs",
                        created_at: expect.any(String),
                        votes: -5
                    })
                })
        });
        test('status:400 - responds with "Bad request" when given wrong value type', () => {
            return request(app)
                .patch('/api/articles/3')
                .send({ inc_votes: 'hello world' })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
        test('status:400 - responds with "Bad request" when given invalid property', () => {
            return request(app)
                .patch('/api/articles/3')
                .send({ not_a_property: 5 })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
    });
    describe('GET /api/users', () => {
        test('status:200 - responds with an array of user objects with single username property', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body: { users } }) => {
                    expect(users).toBeInstanceOf(Array);
                    expect(users).toHaveLength(4);
                    users.forEach(user => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String)
                            })
                        );
                        expect(Object.keys(user).length).toBe(1);
                    })   
                })
        });
    });
    describe('GET /api/users/:username', () => {
        test('status:200 - responds with user object', () => {
            return request(app)
                .get('/api/users/icellusedkars')
                .expect(200)
                .then(({ body: { user } }) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: 'icellusedkars',
                            name: 'sam',
                            avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                          })
                    )
                })
        });
        test('status:404 = responds with "Resource does not exist"', () => {
            return request(app)
                .get('/api/users/i_dont_exist')
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Resource does not exist"
                    })
                })
        });
    });
    describe('GET /api/articles', () => {
        test('status:200 - responds with an array of article objects', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeInstanceOf(Array);
                    expect(articles).toHaveLength(12);
                    articles.forEach(article => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                author: expect.any(String),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number)
                            })
                        )
                    })
                })
        });
        test('status:200 - responds with array sorted by date in descending order', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeSorted({
                        key: 'created_at', 
                        descending: 'true'
                    });
                })
        });
        test('status:200 - responds with array with "comment_count" property', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body: { articles } }) => {
                    articles.forEach(article => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
        });
        test('status:200 - responds with array of articles for given query criteria', () => {
            const allQueries = request(app)
                .get('/api/articles?sort_by=title&order=asc&topic=mitch')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy('title');
                    expect(articles).toHaveLength(11);
                })
            const withoutSortBy = request(app)
                .get('/api/articles?order=asc&topic=mitch')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy('created_at');
                })
            const withoutOrder = request(app)
                .get('/api/articles?sort_by=comment_count&topic=mitch')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeSorted({
                        key: 'comment_count',
                        descending: 'true'
                    })
                })
            return Promise.all([allQueries, withoutSortBy, withoutOrder]);
        });
        test('status:200 - responds with empty array when given topic that doesn\'t exist', () => {
            return request(app)
                .get('/api/articles?topic=slurpy')
                .expect(200)
                .then(({ body: { articles }}) => {
                    expect(articles).toEqual([]);
                })
        });
        test('status:400 - responds with "Invalid query term"', () => {
            return request(app)
                .get('/api/articles?sort_by=title&name=slurpy')
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Invalid query term(s): name"
                    });
                })
        });
        test('status:400 - responds with "Invalid value"', () => {
            const sortBy = request(app)
                .get('/api/articles?sort_by=slurpy')
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Invalid sort_by value"
                    });
                })
            const order = request(app)
                .get('/api/articles?order=helloworld')
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Invalid order value"
                    });
                })
            return Promise.all([sortBy, order]);
        });
    });
    describe('GET /api/articles/:article_id/comments', () => {
        test('status:200 - responds with array of comments for given article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments).toBeInstanceOf(Array);
                    expect(comments).toHaveLength(11);
                    comments.forEach(comment => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String)
                            })
                        );
                    });
                });
        });
        test('status:200 - responds with empty array for article_id with no associated comments', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments).toEqual([]);
                });
        });
        test('status:404 - responds with "Resource does not exist"', () => {
            return request(app)
                .get('/api/articles/999999/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Resource does not exist"
                    });
                })
        });
        test('status:400 - responds with "Bad request"', () => {
            return request(app)
                .get('/api/articles/not_an_id/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
    });
    describe('POST /api/articles/:article_id/comments', () => {
        test('status:200 - responds with posted comment object', () => {
            return request(app)
                .post('/api/articles/4/comments')
                .send({
                    username: 'butter_bridge',
                    body: '#JusticeForMitch'
                })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: 19,
                            author: 'butter_bridge',
                            body: '#JusticeForMitch',
                            article_id: 4
                        })
                    );
                })
        });
        test('status:404 - responds with "Resource does not exist" when given article_id which does not exist in articles table', () => {
            return request(app)
                .post('/api/articles/99999/comments')
                .send({
                    username: 'butter_bridge',
                    body: '#JusticeForMitch'
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Resource does not exist"
                    });
                })
        });
        test('status:404 - responds with "Resource does not exist" when given username which does not exist in users table', () => {
            return request(app)
                .post('/api/articles/4/comments')
                .send({
                    username: 'slurpy',
                    body: 'Off with his head'
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Resource does not exist"
                    });
                })
        });
        test('status:400 - responds with "Bad request" when article_id param is wrong data type', () => {
            return request(app)
                .post('/api/articles/not_an_id/comments')
                .send({
                    username: 'butter_bridge',
                    body: '#JusticeForMitch'
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
        test('status:400 - responds with "Bad request" when body is not formed properly', () => {
            return request(app)
                .post('/api/articles/4/comments')
                .send({
                    not_a_username: 'butter_bridge',
                    not_a_body: '#JusticeForMitch'
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
    });
    describe('DELETE /api/comments/:comment_id', () => {
        test('status:204 - responds with deleted comment object', () => {
            return request(app)
                .delete('/api/comments/5')
                .expect(204)
            .then(() => {
                return request(app)
                .get('/api/articles/1/comments')
                .then(({ body: { comments } }) => {
                    expect(comments).toHaveLength(10);
                })
            }) 
        });
        test('status:404 - responds with "Comment does not exist"', () => {
            return request(app)
                .delete('/api/comments/999999')
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Comment does not exist"
                    });
                })
        });
        test('status:400 - responds with "Bad request"', () => {
            return request(app)
                .delete('/api/comments/not_an_id')
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
    });
    describe('PATCH /api/comments/:comment_id', () => {
        test('status:200 - responds with comment object with incremented votes when given positive value', () => {
            return request(app)
                .patch('/api/comments/3')
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toEqual({
                        comment_id: 3,
                        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                        votes: 101,
                        author: "icellusedkars",
                        article_id: 1,
                        created_at: expect.any(String),
                      })
                })
        });
        test('status:200 - responds with comment object with decremented votes when given negative value', () => {
            return request(app)
                .patch('/api/comments/3')
                .send({ inc_votes: -5 })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toEqual({
                        comment_id: 3,
                        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                        votes: 95,
                        author: "icellusedkars",
                        article_id: 1,
                        created_at: expect.any(String),
                      })
                })
        });
        test('status:400 - responds with "Bad request" when given wrong value type', () => {
            return request(app)
                .patch('/api/comments/3')
                .send({ inc_votes: 'hello world' })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
        test('status:400 - responds with "Bad request" when given invalid property', () => {
            return request(app)
                .patch('/api/comments/3')
                .send({ not_a_property: 5 })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
    });
    describe('POST /api/articles', () => {
        test('status:200 - responds with posted article object', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    author: "lurker",
                    title: "Oldest question finally answered - cats or dogs?",
                    body: "Cats, of course.",
                    topic: "cats"
                })
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: 13,
                            author: "lurker",
                            title: "Oldest question finally answered - cats or dogs?",
                            body: "Cats, of course.",
                            topic: "cats",
                            votes: 0,
                            created_at: expect.any(String),
                            comment_count: 0
                        })
                    );
                })
        });
        test('status:404 - responds with "Resource does not exist" when given author which doesn\'t exist in users table', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    author: "slurpy",
                    title: "Oldest question finally answered - cats or dogs?",
                    body: "Cats, of course.",
                    topic: "cats"
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Resource does not exist"
                    });
                })
        });
        test('status:404 - responds with "Resource does not exist" when given topic which doesn\'t exist in topics table', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    author: "lurker",
                    title: "Oldest question finally answered - cats or dogs?",
                    body: "Cats, of course.",
                    topic: "football"
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Resource does not exist"
                    });
                })
        });
        test('status:400 - responds with "Bad request" when body is not formed properly', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    not_an_author: 'butter_bridge',
                    not_a_body: '#JusticeForMitch'
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({
                        message: "Bad request"
                    });
                })
        });
    });
});
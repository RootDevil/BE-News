const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

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
                    expect(article).toEqual({
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "some gifs",
                        created_at: expect.any(String),
                        votes: 0
                    })
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
                .send({ 'inc_votes': 1 })
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
                .send({ 'inc_votes': -5 })
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
    });
});
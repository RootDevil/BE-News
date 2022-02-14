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
    });
});
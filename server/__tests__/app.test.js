const request = require('supertest');
const db = require('../../db/connection');
const testData = require('../../db/data/test-data/index');
const seed = require('../../db/seeds/seed')
const app = require('../app');

afterAll(() => {
    if (db.end) db.end();
  });

  beforeEach(() => seed(testData));

  describe('1. GET /api/categories', () =>{

    test("status:200, returns an array of category objects", ()=>{
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((response)=>{
            const categories = response.body.categories;
            expect(true).toBe(Array.isArray(categories));
            expect(categories).toHaveLength(4);
            categories.forEach(category =>{
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                )
            })  
        })
    })
  })

  describe('2. 404 Bad Path', () =>{

    test('status:404, sent bad path', ()=>{
        return request(app)
        .get('/badPath')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe("Route not found");
        })
    })
  })

  describe('3. GET /api/reviews', () =>{

    test.only("status:200, returns an array of review objects", ()=>{
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response)=>{
            const reviews = response.body.reviews;
            expect(true).toBe(Array.isArray(reviews));
            expect(reviews).toHaveLength(13);
            reviews.forEach(review =>{
                expect(review).toEqual(
                    expect.objectContaining({
                        category: expect.any(String),
                        comment_count: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
            })  
            expect(reviews).toBeSortedBy('created_at', {descending: true});
        })
    })
  })
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

    test("status:200, returns an array of review objects", ()=>{
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

  describe('4. GET /api/reviews/:review_id', () =>{

    test("status:200, returns a specific review object matching the parametric review_id", ()=>{
        return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then((response)=>{
            const review = response.body.review;
            expect(review.title).toBe('Agricola');
            expect(review.designer).toBe('Uwe Rosenberg');
            expect(review.owner).toBe('mallionaire');
            expect(review.review_img_url).toBe( 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png');
            expect(review.review_body).toBe('Farmyard fun!');
            expect(review.category).toBe('euro game');
            expect(review.created_at).toBe('2021-01-18T10:00:20.514Z');
            expect(review.votes).toBe(1);
            expect(review.review_id).toBe(1);
        })
    })

    test("status:404, valid review_id but does not exist", ()=>{
        return request(app)
        .get('/api/reviews/100000')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe("ID not found");
        })
    })

    test("status:400, invalid review_id", ()=>{
        return request(app)
        .get('/api/reviews/bread')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe("Invalid ID given");
        })
    })
  })

  describe('5. GET /api/reviews/:review_id/comments', () =>{

    test("status:200, returns an array of comments matching the parametric review_id", ()=>{
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then((response)=>{
            const comments = response.body.comments;
            expect(comments).toHaveLength(3);
            comments.forEach(comment =>{
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        review_id: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
            }) 
            expect(comments).toBeSortedBy('created_at', {descending: true});
        })
    })

    test("status:200, returns a valid empty array as review_id is valid and exists but there are are no assicated comments", ()=>{
        return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then((response)=>{
            const comments = response.body.comments;
            expect(comments).toEqual([]);
        })
    })

    test("status:404, valid review_id but does not exist", ()=>{
        return request(app)
        .get('/api/reviews/100000/comments')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe("ID not found");
        })
    })

    test("status:400, invalid review_id", ()=>{
        return request(app)
        .get('/api/reviews/bread/comments')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe("Invalid ID given");
        })
    })
  })

  describe('6. PUSH /api/reviews/:review_id/comments', () =>{

    test("status:201, returns a comment matching the parametric review_id", ()=>{
        const newComment = {
            username: "philippaclaire9",
            body: "Loved the film, wicked!"
        };
        return request(app)
        .post('/api/reviews/2/comments')
        .send({newComment})
        .expect(201)
        .then((response)=>{
            const comment = response.body.comment;
            expect(comment.comment_id).toBe(7);
            expect(comment.body).toBe( "Loved the film, wicked!");
            expect(comment.review_id).toBe(2);
            expect(comment.author).toBe("philippaclaire9");
            expect(comment.votes).toBe(0);
        })
    })

    test("status:201, returns a comment matching the parametric review_id while being given excess data", ()=>{
        const newComment = {
            username: "philippaclaire9",
            body: "Loved the film, wicked!",
            votes: 3

        };
        return request(app)
        .post('/api/reviews/2/comments')
        .send({newComment})
        .expect(201)
        .then((response)=>{
            const comment = response.body.comment;
            expect(comment.comment_id).toBe(7);
            expect(comment.body).toBe( "Loved the film, wicked!");
            expect(comment.review_id).toBe(2);
            expect(comment.author).toBe("philippaclaire9");
            expect(comment.votes).toBe(0);
        })
    })

    test('status:404, passed user that does not"', () =>{
        const newComment = {
            username: "karlriv",
            body: "Loved the film, wicked!",
            };
        return request(app)
        .post('/api/reviews/2/comments')
        .send({newComment})
        .expect(404)
        .then((response) =>{
            expect(response.body.msg).toBe("ID not found");
        })
    })

    test('status:400, malformed body, no body"', () =>{
        const newComment = {
            username: "philippaclaire9"
            };
        return request(app)
        .post('/api/reviews/2/comments')
        .send({newComment})
        .expect(400)
        .then((response) =>{
            expect(response.body.msg).toBe("Issue with either the body or username");
        })
    })  

    test('status:400, malformed body, no username"', () =>{
        const newComment = {
            body: "Loved the film, wicked!"
            };
        return request(app)
        .post('/api/reviews/2/comments')
        .send({newComment})
        .expect(400)
        .then((response) =>{
            expect(response.body.msg).toBe("Issue with either the body or username");
        })
    }) 

    test("status:404, valid review_id but does not exist", ()=>{
        const newComment = {
            username: "philippaclaire9",
            body: "Loved the film, wicked!"
        };
        return request(app)
        .post('/api/reviews/100000/comments')
        .send({newComment})
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe("ID not found");
        })
    })

    test("status:400, invalid review_id", ()=>{
        const newComment = {
            username: "philippaclaire9",
            body: "Loved the film, wicked!"
        };
        return request(app)
        .post('/api/reviews/bread/comments')
        .send({newComment})
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe("Invalid ID given");
        })
    })
  })

 
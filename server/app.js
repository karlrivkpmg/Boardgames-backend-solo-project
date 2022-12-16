const {handle404s, handleCustomErrors, handle400s } = require('./controllers/controller.errors');

const {getCategories, getReviews, getReviewById, getReviewCommentsById, postCommentByReviewId, patchReviewById, getUsers, deleteCommentById} = require('./controllers/controller.boardgames');
const express = require('express');

const app = express();
app.use(express.json());

app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getReviewCommentsById);
app.post('/api/reviews/:review_id/comments', postCommentByReviewId);
app.patch('/api/reviews/:review_id', patchReviewById);
app.get('/api/users', getUsers);
app.delete('/api/comments/:comment_id', deleteCommentById);


app.all('/*', handle404s);

app.use(handleCustomErrors);
app.use(handle400s)


module.exports = app;
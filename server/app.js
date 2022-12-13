const {handle404s } = require('./controllers/controller.errors');
const {getCategories} = require('./controllers/controller.boardgames');
const {getCategories, getReviews} = require('./controllers/controller.boardgames');
const express = require('express');

const app = express();

app.get('/api/categories', getCategories)

app.get('api/reviews/:review_id', getReviewById);
app.get('/api/reviews', getReviews);

app.all('/*', handle404s);


module.exports = app;
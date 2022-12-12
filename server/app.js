const express = require('express');
const {handle404s } = require('./controllers/controller.errors');
const {getCategories} = require('./controllers/controller.boardgames');



const app = express();
app.use(express.json());

app.get('/api/categories', getCategories)

app.all('/*', handle404s);


module.exports = app;
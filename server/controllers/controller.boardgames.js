const { selectCategories } = require('../models/model.boardgames')

exports.getCategories = (req, res) => {
    selectCategories()
    .then((categories)=>{
        res.status(200).send(categories);
    })
}
const { selectCategories, selectReviews, selectReviewById } = require('../models/model.boardgames')

exports.getCategories = (req, res) => {
    selectCategories()
    .then((categories)=>{
        res.status(200).send({categories});
    })
}

exports.getReviews = (req, res) =>{
    selectReviews()
    .then((reviews)=>{
        res.status(200).send({reviews});
    })
}

exports.getReviewById = (req, res, next) =>{
    const {review_id} = req.params;
    selectReviewById(review_id)
    .then((review)=>{
        res.status(200).send({review});
    })
    .catch((err)=>{
        next(err);
    })
}

const { selectCategories, selectReviews, selectReviewById, selectReviewCommentsById, insertCommentByReviewId } = require('../models/model.boardgames')

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

exports.getReviewCommentsById = (req, res, next) =>{
    const {review_id} = req.params;
    const promises = [ selectReviewCommentsById(review_id), selectReviewById(review_id)];

    Promise.all(promises)
    .then(([comments])=>{
        res.status(200).send({comments});
    }).catch((err)=>{
        next(err);
    });

}

exports.postCommentByReviewId = (req, res, next) =>{
    const {review_id} = req.params;
    const {newComment} = req.body;

    insertCommentByReviewId(review_id, newComment)
    .then((comment)=>{
        res.status(201).send({comment});
    })
    .catch((err)=>{
        console.log(err);
        next(err);
    })
}




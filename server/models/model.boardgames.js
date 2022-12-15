const db = require('../../db/connection');

exports.selectCategories = () =>{
    const sql = `SELECT * 
               FROM categories;`

    return db
    .query(sql)
    .then((result)=>{
        return(result.rows);
    })
}

    
exports.selectReviews = () =>{
    const sql = `SELECT title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id
    ORDER BY created_at desc;
    `
    return db.query(sql)
    .then((result)=>{
    return result.rows;
})
}

exports.selectReviewById = (review_id) => {
    const sql = `SELECT * 
                FROM reviews
                WHERE review_id = $1;`
    return db
    .query(sql, [review_id])
    .then((result)=>{
        if(result.rows.length ===0){
           return Promise.reject({msg: "ID not found", status:404})
        }else{
            return result.rows[0];
        }
    })
}

exports.selectReviewCommentsById = (review_id) =>{
    const sql = `SELECT *
               FROM comments
               WHERE review_id = $1
               ORDER BY created_at desc;`
    return db
    .query(sql, [review_id])
    .then((result =>{
        return result.rows;
    }));
} 

exports.insertCommentByReviewId = (review_id, newComment) =>{
    const sql = `INSERT INTO comments (review_id, body, author)
                values($1,$2,$3)
                RETURNING *;`

    return db.query(sql,[review_id, newComment.body, newComment.username])
    .then((result)=>{
        return result.rows[0];
    })
}

exports.updateReviewById = (promises) =>{
    const review = promises[0];
    const review_id =promises[1];
    const {voteInc} = promises[2];

    let sql =``;
    if(typeof voteInc !== "number"){
        return Promise.reject({msg: "Incorrect type passed for voteInc", status:400});
    }else{
        if(review.votes + voteInc >= 0){
            sql = `UPDATE reviews
                    SET votes = votes +$1
                    WHERE review_id = $2
                    RETURNING *;`
        }else{
            return Promise.reject({msg: "Attempting to decrement votes by too much", status:404});
        }
    }

    return db
    .query(sql, [voteInc, review_id])
    .then((result)=>{
        return result.rows[0];
    })

}

exports.selectUsers = () =>{
    const sql = `SELECT * 
                 FROM users;`
    return db
    .query(sql)
    .then((result)=>{
        return result.rows;
    })
}
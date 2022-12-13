const db = require('../../db/connection');

exports.selectCategories = () =>{
    let sql = `SELECT * 
               FROM categories;`

    return db
    .query(sql)
    .then((result)=>{
        return(result.rows);
    })
}

    
exports.selectReviews = () =>{
    let sql = `SELECT title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id, COUNT(comments.review_id) AS comment_count
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
    let sql = `SELECT * 
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
    let sql = `SELECT *
               FROM comments
               WHERE review_id = $1
               ORDER BY created_at desc;`
    return db
    .query(sql, [review_id])
    .then((result =>{
        return result.rows;
    }));
} 
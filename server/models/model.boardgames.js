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
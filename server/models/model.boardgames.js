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

    
exports.selectReviews = (promises) =>{
    const categories = promises[0];
    const category = promises[1];
    let sort_by = promises[2];
    let order = promises[3];
    const allowedCategories = categories.map(cat=> cat.slug);
    const allowedSorts = ['title', 'designer', 'owner', 'review_img_url', 'review_body', 'category', 'created_at', 'votes', 'review_id'];
    const allowedOrders = ['asc', 'desc'];
    const queryValues = [];

    if(sort_by === undefined){
        sort_by = 'created_at';
    }

    if(order === undefined){
        order ='desc';
    }

    if(!allowedSorts.includes(sort_by)){
        return Promise.reject({msg: "Column does not exist", status:400});
    }

    if(!allowedOrders.includes(order)){
        return Promise.reject({msg: "Order format does not exist", status:400});
    }

    let sql = `SELECT title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    `

    if(category !== undefined){
        if(allowedCategories.includes(category)){
            queryValues.push(category);
            sql += `WHERE reviews.category = $1 `;
        }
        else{
            return Promise.reject({msg: "Category does not exist", status:400});
        }
       
    }

    sql +=  `
    GROUP BY title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id
    ORDER BY ${sort_by} ${order};`

    return db.query(sql, queryValues)
    .then((result)=>{
    return result.rows;
})
}

exports.selectReviewById = (review_id) => {
    const sql = `SELECT title, designer, owner, review_img_url, review_body, category,reviews.created_at, reviews.votes, reviews.review_id, COUNT(comments.review_id) AS comment_count
                FROM reviews
                LEFT JOIN comments
                ON reviews.review_id = comments.review_id
                WHERE reviews.review_id = $1
                GROUP BY
                title, designer, owner, review_img_url, review_body, category, review_body, reviews.created_at, reviews.votes, reviews.review_id;`
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

exports.removeCommentById = (comment_id) =>{
    return db
    .query(`DELETE FROM comments WHERE comment_id = $1
    RETURNING *;`, [comment_id])
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({msg: "ID not found", status:404})
        }
        return;
    })
}
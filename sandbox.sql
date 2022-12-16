\c nc_games_test
select category, COUNT(category)
FROM reviews
GROUP BY category;

SELECT title, designer, owner, review_img_url, review_body, category,reviews.created_at, reviews.votes, reviews.review_id, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = 1
    GROUP BY
    title, designer, owner, review_img_url, review_body, category, review_body, reviews.created_at, reviews.votes, reviews.review_id;

    DELETE FROM comments WHERE comment_id = 2
    RETURNING *;
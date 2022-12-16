\c nc_games_test
SELECT title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id, COUNT(comments.review_id) AS comment_count
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
WHERE reviews.category = 'dexterity'
GROUP BY title, designer, owner, review_img_url, category,reviews.created_at, reviews.votes, reviews.review_id
ORDER BY created_at desc;
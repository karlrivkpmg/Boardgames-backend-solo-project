\c nc_games_test
select category, COUNT(category)
FROM reviews
GROUP BY category;
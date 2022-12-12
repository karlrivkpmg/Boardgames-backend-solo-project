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
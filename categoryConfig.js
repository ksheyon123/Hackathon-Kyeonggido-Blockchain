const mysql = require('mysql2/promise');

var categoryConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'category',
};

const pool = mysql.createPool(categoryConfig);
module.exports = pool;

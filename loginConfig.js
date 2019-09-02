const mysql = require('mysql2/promise');

var loginConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'kyeonggi',
};

const pool = mysql.createPool(loginConfig);
module.exports = pool;

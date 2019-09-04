const mysql = require('mysql2/promise');

var incConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'seller',
};

const pool = mysql.createPool(incConfig);
module.exports = pool;

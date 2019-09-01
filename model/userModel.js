var mysql = require('mysql');
var myConnection = mysql.createConnection(require('../loginConfig'));

myConnection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});

class User {
    //Login
    selectOneByUser(req) {
        var InsertedUser = req.body.userID;
        var InsertedPassword = req.body.userPW;
        return new Promise( (resolve, reject) => {
            const sql = `SELECT * FROM kyeonggidb WHERE user = '${InsertedUser}' and password = '${InsertedPassword}'`;
            myConnection.query(sql, function(err, data) {
                if(err) {
                    console.log('MySQL Reading Err');
                    reject(err);
                }
                resolve(data);
            })
        });
        
        
        
        // new Promise(
        //     async (resolve, reject) => {            
        //         try {
        //             const sql = `SELECT * FROM kyeonggidb WHERE user = '${InsertedUser}' and password = '${InsertedPassword}'`;
        //             await myConnection.query(sql);
        //             resolve(result);
        //         } catch {
        //             reject('Select One By User Err');
        //         }
        //     })

    }
}

module.exports = new User();
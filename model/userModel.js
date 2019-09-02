var myConnection = require('../loginConfig');

// myConnection.connect(function (err) {
//     if (err) {
//         return console.error('error: ' + err.message);
//     }

//     console.log('Connected to the MySQL server.');
// });

class User {
    //Login
    login(req) {
        var InsertedUser = req.body.userID;
        var InsertedPassword = req.body.userPW;
        return new Promise(
            async (resolve, reject) => {
                const sql = `SELECT * FROM kyeonggidb WHERE id = ? AND password = ?`;
                try {
                    var result = await myConnection.query(sql, [InsertedUser, InsertedPassword]);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    checkID() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT id FROM kyeonggidb';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result);
                } catch(err) {
                    reject(err);
                }
            }
        )
    }
    
    selectAll() {
        return new Promise( 
            async (resolve, reject) => {
                const sql = 'SELECT * FROM kyeonggidb';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result);
                } catch(err) {
                    reject(err);
                }
            }
        )
    }

    register(req) {
        console.log('register' , req.body);
        return new Promise(
            async (resolve, reject) => {
                try {
                    var allData = await this.selectAll();
                    let flags = 0;
                    for(const content of allData[0]) {
                        if(content.id == req.body.userID) {
                            flags = 1;
                            break;
                        }
                        if(content.id == req.body.userName) {
                            flags = 2;
                            break;
                        }
                    }
                    switch(flags) {
                        case 1:
                            resolve('중복된 아이디 입니다.');
                            break;
                        case 2:
                            resolve('이미 회원가입하셨습니다.');
                            break;
                        default :
                        const sql = 'INSERT INTO kyeonggidb (id, password, name, address, gender, phonenumber) values (? ,? ,?, ?, ?, ?)';
                        await myConnection.query(sql, [req.body.userID, req.body.userPW, req.body.userName, req.body.userAddr, req.body.userGen, req.body.userPN]);
                        req.session.user = {
                            userID: req.body.userID,
                            userPW: req.body.userPW
                        }
                        resolve(req.session.user);
                    }   
                } catch(err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new User();
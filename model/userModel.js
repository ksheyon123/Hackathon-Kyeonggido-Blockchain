var myConnection = require('../dbConfig');
var web3js = require('./web3');
var Web3 = require("web3");
var web3 = new Web3();


class User {
    //Login
    login(req) {
        var InsertedUser = req.body.userID;
        var InsertedPassword = req.body.userPW;
        return new Promise(
            async (resolve, reject) => {
                const sql = `SELECT * FROM kyeonggidb WHERE user = ? AND password = ?`;
                try {
                    //geth 에서 지갑 Info load하는 코드
                    var result = await myConnection.query(sql, [InsertedUser, InsertedPassword]);
                    resolve(result);
                } catch (err) {
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
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    register(req) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var allData = await this.selectAll();
                    let flags = 0;
                    for (const content of allData[0]) {
                        if (content.id == req.body.userID) {
                            flags = 1;
                            break;
                        }
                        if (content.name == req.body.userName) {
                            flags = 2;
                            break;
                        }
                    }
                    switch (flags) {
                        case 1:
                            resolve('중복된 아이디 입니다.');
                            break;
                        case 2:
                            resolve('이미 회원가입하셨습니다.');
                            break;
                        default:
                            var web3Data = await web3js.makeAccounts(req.body.userID);
                            console.log('web3Data', web3Data);
                            const sql = 'INSERT INTO kyeonggidb (user, password, name, address, gender, phonenumber, wallet) values (? ,? ,?, ?, ?, ?, ?)';
                            await myConnection.query(sql, [req.body.userID, req.body.userPW, req.body.userName, req.body.userAddr, req.body.userGen, req.body.userPN, web3Data]);
                            req.session.user = {
                                userID: req.body.userID,
                                userPW: req.body.userPW,
                                userName: req.body.userName,
                                userAddr: req.body.userAddr,
                                userGen: req.body.userGen,
                                userPN: req.body.userPN,
                                userDN: 0,
                                userWallet: web3Data
                            }
                            resolve(req.session.user);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    //mynfoChange -> sql save
    myinfoChange(req) {
        console.log('req.body', req.body);
        data = {
            userData: req.body
        }
        return new Promise(
            async (resolve, reject) => {
                const sql = `UPDATE kyeonggidb SET address = ?, phonenumber = ? WHERE user = ?`;
                try {
                    var result = myConnection.query(sql, [data.userData.userAddr, data.userData.userPN, req.session.user.userID]);
                    req.session.user.userAddr = data.userData.userAddr;
                    req.session.user.userPN = data.userData.userPN;
                    resolve(req.session.user);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    //판매자 등록
    tobeseller(req) {
        var data = {
            userID: req.session.user.userID,
            incInfo: req.body
        }
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (req.session.user.userDN == 0) {
                        const sql = 'UPDATE kyeonggidb SET status = 1 WHERE user = ?';
                        console.log(sql);
                        var result = await myConnection.query(sql, data.userID);
                        console.log(result);
                        //inc Database에 Data저장
                        const incsql = 'INSERT INTO inc (user, inc_name, inc_address, inc_info) values (?, ?, ?, ?)';
                        await myConnection.query(incsql, [data.userID, data.incInfo.inc_name, data.incInfo.inc_address, data.incInfo.inc_info]);

                        resolve(req.session.user);
                    } else if (req.session.user.userDN == 1) {
                        resolve(1);
                    } else {
                        resolve(2);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    //판매자 허가 대기자 정보 호출
    adminConfirm() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM kyeonggidb WHERE status = 1';
                try {
                    var result = myConnection.query(sql);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    //회사 정보 로드
    selectInc() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM kyeonggi.inc WHERE user IN (SELECT id FROM kyeonggi.kyeonggidb WHERE status = 1)';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    //판매자 전환 완료
    beingSellerComplete(data) {
        console.log(data);
        return new Promise(
            async (resolve, reject) => {
                const sql = 'UPDATE kyeonggidb, inc SET kyeonggidb.status = 0, kyeonggidb.dnum = 1, inc.inc_confirm = 1 WHERE kyeonggidb.id = ? AND inc.user = ?';
                try {
                    var result = await myConnection.query(sql, [data, data]);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    //Buyer 의 address Balance 호출
    CallBuyerWalletBalance(data) {
        return new Promise(
            async (resolve, reject) => {
                console.log(data.itemData);
                const sql = `SELECT wallet FROM kyeonggidb WHERE user = "${data.itemData.user}"`;
                try {
                    var result = await myConnection.query(sql, data.itemData.user);
                    console.log('Transaction Complete Function', data.userData);
                    try {
                        //Get buyer's Balance 
                        var buyerBalance = await web3js.getBalanceOfBuyer(data.userData.userWallet);
                        console.log('buyerBalance', buyerBalance);
                        var buyerBalanceC = buyerBalance / 1000000000000000000;


                        resolve(buyerBalanceC);
                    } catch(err) {
                        console.log(err);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new User();
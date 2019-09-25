var myConnection = require('../dbConfig');
var web3js = require('./web3');
var Contract = require('./abi');
var myContract = Contract.myContract;
var web3 = Contract.web3;

web3.setProvider(
    new web3.providers.HttpProvider('http://localhost:7545')
);

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
                            var web3Data = await web3js.makeAccounts(req.body.userWalletPW);
                            const sql = 'INSERT INTO kyeonggidb (user, password, name, address, phonenumber, wallet, status) values (? ,? ,?, ?, ?, ?, ?)';
                            await myConnection.query(sql, [req.body.userID, req.body.userPW, req.body.userName, req.body.userAddr, req.body.userPN, web3Data, 0]);
                            req.session.user = {
                                userID: req.body.userID,
                                userPW: req.body.userPW,
                                userName: req.body.userName,
                                userAddr: req.body.userAddr,
                                userPN: req.body.userPN,
                                userDN: 0,
                                userWallet: web3Data,
                                userStatus: 0
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
                        //kyeonggidb Status Update to 1
                        const sql = 'UPDATE kyeonggidb SET status = 1 WHERE user = ?';
                        var result = await myConnection.query(sql, [data.userID]);

                        //Put userStatus 
                        const statussql = 'SELECT status FROM kyeonggidb WHERE user = ?';
                        var statusValue = await myConnection.query(statussql, [data.userID]);
                        req.session.user.userStatus = statusValue[0][0].status;

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
                const sql = 'SELECT * FROM kyeonggi.inc WHERE user IN (SELECT user FROM kyeonggi.kyeonggidb WHERE status = 1)';
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
                const sql = `SELECT wallet FROM kyeonggidb WHERE user = "${data}" AND status = 1`;
                console.log(sql);
                var result = await myConnection.query(sql);
                console.log('wallet Result :', result[0][0]);
                //Mindhub Solidity
                await myContract.methods._register_seller(result[0][0].wallet).send({ from: "0x3b8886c692611ae5113d8ba5dec7392d839ab3b9" });
                try {
                    if (result[0][0].wallet) {
                        const sql = 'UPDATE kyeonggidb, inc SET kyeonggidb.status = 0, kyeonggidb.dnum = 1, inc.inc_confirm = 1 WHERE kyeonggidb.user = ? AND inc.user = ?';
                        var result1 = await myConnection.query(sql, [data, data]);
                        resolve(result1);
                    } else {
                        resolve('None');
                    }
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
                try {
                    console.log('CallBuyerWalletBalance', data.userData);
                    //Get buyer's Balance 
                    var ableToken = await myContract.methods._get_ablebalance(data.userData.userWallet).call();
                    console.log('buyerBalance', ableToken);
                    resolve(ableToken);
                } catch (err) {
                    reject(err);
                }

            }
        )
    }

    //거래 내역 조회
    CallBoughtItemData(data) {
        return new Promise(
            async (resolve, reject) => {
                const sql = `SELECT * FROM solditem WHERE user = '${data}'`;
                try {
                    var result = await myConnection.query(sql);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new User();
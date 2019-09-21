var myConnection = require('../dbConfig');
// var Web3 = require("web3");
// var web3 = new Web3();
var Contract = require('./abi');
var myContract = Contract.myContract;
var web3 = Contract.web3;

web3.setProvider(
    new web3.providers.HttpProvider('http://localhost:7545')
);

class web3js {
    //register 시, eth 계정 생성
    makeAccounts(data) {
        console.log('web3js로 넘어온 data', data);
        return new Promise(
            async (resolve, reject) => {
                try {
                    var newAccount = await web3.eth.personal.newAccount(data);
                    console.log('Ether Account', newAccount);
                    resolve(newAccount);
                } catch (err) {
                    reject('Ether newAccount register Err');
                }
            }
        );
    }


    //Ether Account 호출
    sendAccountInfo(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    console.log('sendAccounts');
                    var ableToken = await myContract.methods._get_ablebalance(data).call();
                    console.log('ableToken : ', ableToken);

                    resolve(ableToken);
                } catch (err) {
                    console.log(err);
                    reject('Cannot getAccounts');
                }
            }
        );
    }

    //token 전송
    sendTokenFromAdmin(data) {
        console.log('sendTokenFromAdmin', data);
        console.log('sendTokenFromAdmin', data.userData.userWallet);
        console.log('sendTokenFromAdmin', typeof (parseInt(data.userMoney)));
        console.log('sendTokenFromAdmin', parseInt(data.userMoney));
        return new Promise(
            async (resolve, reject) => {
                try {
                    var result = await myContract.methods._token_purchase(data.userData.userWallet, parseInt(data.userMoney)).send({ from: "0x3b8886c692611ae5113d8ba5dec7392d839ab3b9", gas: 3000000 });
                    // var result = await web3.eth.sendTransaction({ from: "0xf3ac3482fa86ef9c437c5f4f3adf820634c3f056", to: `${data.userData.userWallet}`, value: `${data.userMoney}` });
                    if (result.blockNumber) {
                        var ableToken = await myContract.methods._get_ablebalance(data.userData.userWallet).call();
                        console.log('ableToken : ', ableToken);
                        data.userData.userBalance = ableToken;
                        resolve(data);
                    } else {
                        console.log('get Transaction Info Error');
                        reject(err);
                    }
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            }
        );
    }

    sendToken(data) {
        console.log('sendTokenFrom', data);
        return new Promise(
            async (resolve, reject) => {
                try {
                    const sql = `SELECT wallet FROM kyeonggidb WHERE user ="${data.itemData.user}"`;
                    var result = await myConnection.query(sql);
                    //sendTransaction userData: 구매자 result : 판매자
                    // var txResult = await web3.eth.sendTransaction({ from: `${data.userData.userWallet}`, to: `${result[0][0].wallet}`, value: `${data.itemData.item_price * 1000000000000000000}` });
                    var txResult = await myContract.methods._purchase_product(data.userData.userWallet, data.itemData.item_code).send({ from: "0x3b8886c692611ae5113d8ba5dec7392d839ab3b9", gas: 3000000 });
                    var balance = await myContract.methods._get_ablebalance(data.userData.userWallet).call();

                    //Sum After Transaction userBalance
                    data.userData.userBalance = balance

                    //Buying Data Put In Database
                    if (txResult.blockNumber) {

                        //Get Block Data
                        var blockData = await web3.eth.getBlock(txResult.blockNumber);

                        //Solve Transaction Code into Hex Transaction Code 
                        var txData = blockData.transactions.toString();
                        data = {
                            blockNum: txResult.blockNumber,
                            tx: txData,
                            user: data.userData.userID,
                            itemS: data.itemData.user,
                            itemP: data.itemData.item_price,
                            itemC: data.itemData.item_code,
                            itemN: data.itemData.item_name
                        }

                        console.log('data.tx', data.tx);
                        const sql = 'INSERT INTO solditem (user, seller, item_name, item_price, blocknum, tx, item_code) values (?, ?, ?, ?, ?, ?, ?)';
                        await myConnection.query(sql, [data.user, data.itemS, data.itemN, data.itemP, data.blockNum, data.tx, data.itemC]);
                    } else {
                        console.log('Get Block Number Fail');
                    }
                    resolve(data);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            }
        );
    }

    // //Token 구매자에서 판매자로 전달
    // getBalanceOfBuyer(data) {
    //     return new Promise(
    //         async (resolve, reject) => {
    //             try {
    //                 web3.setProvider(
    //                     new web3.providers.HttpProvider('http://localhost:7545')
    //                 );
    //                 var ableToken = await myContract.methods._get_ablebalance(data.userData.userWallet).call();
    //                 console.log('getBalanceOfBuyer', ableToken);
    //                 resolve(result);
    //             } catch (err) {
    //                 reject(err);
    //             }
    //         });
    // }
    //wallet Unlock 현재는 의미 없음
    unlockWallet(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    console.log('unlock data', data);
                    var result = await web3.eth.personal.unlockAccount(data.walletAddr, data.walletPW, 15000);
                    console.log('unlockresult', result);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    finalConfirmation(data) {
        //you received data = {id, confirm}
        return new Promise(
            async (resolve, reject) => {
                console.log('data.confirm', data.confirm);
                try {
                    // Get item_code from solditem based on id
                    // const sql = 'SELECT item_code FROM solditem WHERE id = ?'
                    // var result = await myConnection.query(sql, [data.id])
                    // var itemCode = result[0][0].item_code;
                    var payID = data.id-1;
                    console.log('payID', payID);
                    if (data.confirm == 0) {
                        var result = await myContract.methods._purchase_confirmation(payID).send({ from: "0x3b8886c692611ae5113d8ba5dec7392d839ab3b9", gas: 3000000 });
                        //거래 확정 tx 생성
                        console.log(result);
                        resolve(0);
                    } else if (data.confirm == 1) {
                        await myContract.methods._adobt(payID).send({ from: "0x3b8886c692611ae5113d8ba5dec7392d839ab3b9", gas: 3000000 });
                        //거래 취소 tx 생성
                        resolve(1)
                    } else {
                        //예외 Err
                        resolve(2);
                    }
                } catch (err) {
                    console.log('Buying Final Confirm Err : ', err);
                }
            }
        )
    }
}



module.exports = new web3js();



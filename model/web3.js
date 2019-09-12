var myConnection = require('../dbConfig');
var Web3 = require("web3");
var web3 = new Web3();


class web3js {
    //register 시, eth 계정 생성
    makeAccounts(data) {
        console.log('web3js로 넘어온 data', data);
        return new Promise(
            async (resolve, reject) => {
                try {
                    web3.setProvider(
                        new web3.providers.HttpProvider('http://localhost:8545')
                    );
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
                    web3.setProvider(
                        new web3.providers.HttpProvider('http://localhost:8545')
                    );
                    var accountInfo = await web3.eth.getBalance(data);
                    var money = accountInfo / 1000000000000000000;
                    resolve(money);
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
        return new Promise(
            async (resolve, reject) => {
                try {
                    web3.setProvider(
                        new web3.providers.HttpProvider('http://localhost:8545')
                    );
                    var result = await web3.eth.sendTransaction({ from: "0x07040cea6aac8bf4337dd412c0af7bae1af08dcf", to: `${data.userData.userWallet}`, value: `${data.userMoney}` });
                    if (result.blockNumber) {

                        //Under Below 4 Statement should be a Function
                        //Get Block Data
                        var blockData = await web3.eth.getBlock(result.blockNumber);

                        //Solve Transaction Code into Hex Transaction Code 
                        var txData = blockData.transactions.toString();

                        //Get Transaction Information
                        var TransactionData = await web3.eth.getTransaction(txData);

                        //Sum After Transaction userBalance
                        data.userData.userBalance = data.userData.userBalance + TransactionData.value / 1000000000000000000;
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
                    web3.setProvider(
                        new web3.providers.HttpProvider('http://localhost:8545')
                    );
                    const sql = `SELECT wallet FROM kyeonggidb WHERE user ="${data.itemData.user}"`;
                    var result = await myConnection.query(sql);
                    //sendTransaction userData: 구매자 result : 판매자
                    var txResult = await web3.eth.sendTransaction({ from: `${data.userData.userWallet}`, to: `${result[0][0].wallet}`, value: `${data.itemData.item_price * 1000000000000000000}` });

                    var balance = await web3.eth.getBalance(data.userData.userWallet);

                    //Sum After Transaction userBalance
                    data.userData.userBalance = balance / 1000000000000000000;

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
                            itemC: data.itemData.item_code
                        }

                        console.log('data.tx', data.tx);
                        const sql = 'INSERT INTO solditem (user, seller, item_price, blocknum, tx, item_code) values (?, ?, ?, ?, ?, ?)';
                        await myConnection.query(sql, [data.user, data.itemS, data.itemP, data.blockNum, data.tx, data.itemC]);

                        //Get Transaction Information
                        //var TransactionData = await web3.eth.getTransaction(txData);
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

    //Token 구매자에서 판매자로 전달
    getBalanceOfBuyer(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    web3.setProvider(
                        new web3.providers.HttpProvider('http://localhost:8545')
                    );
                    var result = await web3.eth.getBalance(data);
                    console.log('getBalanceOfBuyer', result);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
    }
    //wallet Unlock 현재는 의미 없음
    unlockWallet(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    web3.setProvider(
                        new web3.providers.HttpProvider('http://localhost:8545')
                    );
                    var result = await web3.eth.personal.unlockAccount(data.walletAddr, data.walletPW, 0);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

}

module.exports = new web3js();



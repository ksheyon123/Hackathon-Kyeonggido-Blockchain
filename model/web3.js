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
                } catch(err) {
                    reject('Ether newAccount register Err');
                }
            }
        )
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
                } catch(err) {
                    console.log(err);
                    reject('Cannot getAccounts');
                }
            }
        )
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
                    var result = await web3.eth.sendTransaction({from : "0x07040cea6aac8bf4337dd412c0af7bae1af08dcf", to: `${data.userData.userWallet}`, value: `${data.userMoney}` });
                    if(result.blockNumber) {

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
                        rejecr(err);
                    }
                } catch(err) {
                    console.log(err);
                    reject(err);
                }
            }
        )
    }
    //Token 구매자에서 판매자로 전달
    sendTokenFromBuyerToSeller() {
        return new Promise(
            async (resolve, reject) => {

            }
        )
    }
}

module.exports = new web3js();



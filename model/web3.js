var Web3 = require("web3");
var web3 = new Web3();

class web3js {
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
                    var money = accountInfo / 1000000000000000000
                    resolve(money);
                } catch(err) {
                    console.log(err);
                    reject('Cannot getAccounts');
                }
            }
        )
    }

    sendToken(data) {
        console.log(data);
        return new Promise(
            async (resolve, reject) => {
                try {
                    web3.setProvider(
                        new web3.providers.HttpProvider('http://localhost:8545')
                    );
                    var result = web3.eth.sendTransaction({from : "0x07040cea6aac8bf4337dd412c0af7bae1af08dcf", to: `${data.userWallet}`, value: `${data.userMoney}` });
                    resolve(result);
                } catch(err) {
                    console.log(err);
                    reject(err);
                }
            }
        )
    }
}

module.exports = new web3js();



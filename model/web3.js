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
}

module.exports = new web3js();



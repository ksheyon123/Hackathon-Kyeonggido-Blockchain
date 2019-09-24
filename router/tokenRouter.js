var express = require('express');
var tokenRouter = express.Router();
var fs = require('fs');
var web3js = require('../model/web3');
var userModel = require('../model/userModel');
var dataModel = require('../model/dataModel');
var Contract = require('../model/abi');
var myContract = Contract.myContract;
var web3 = Contract.web3;

tokenRouter.post('/tokenlogin', async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.userID == req.session.user.userID) {
            result = await userModel.login(req);
            console.log('token Login result', result[0][0]);
            await fs.readFile('views/token/pay_back.html', async (err, data) => {
                if(err) {
                    console.log('fs.ReadFile Err : ', err);
                }
                res.render('token/pay_back.html');
            });
            
        } else {
            res.status(500).send('Wrong Data ');
        }
    } catch (err) {
        console.log('token Login Err : ', err);
    }
});


tokenRouter.get('/buytoken', (req, res) => {
    data = {
        userData: req.session.user
    }
    res.render('token/buytoken.html', { data: data });
});

//토큰 구매
tokenRouter.post('/buytoken', async (req, res) => {
    try {
        console.log(req.body);
        var token = req.body.token;
        data = {
            userData: req.session.user,
            userMoney: token
        }
        var result = await web3js.sendTokenFromAdmin(data);
        console.log('buytoken result', result);
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});

//상품 거래
tokenRouter.post('/contract', async (req, res) => {
    try {
        var data = JSON.parse(req.body.data);
        data = {
            userData: req.session.user,
            itemData: data
        }
        //seller Wallet Balance 호출
        var result = await userModel.CallBuyerWalletBalance(data);

        //Comparing buyerBalance with item_price(0 : lack of Balance )
        if (result >= data.itemData.item_price) {
            //Token Send Function
            var call = await web3js.sendToken(data);
            console.log('balance', call);
            if(call == 0) {
                await dataModel.UpItemRank(data.itemData.id);
            }
            res.redirect('/');
        } else {
            console.log('잔액 부족');
            res.redirect('/');
        }

    } catch (err) {
        throw err;
    }
});

//wallet Unlock 현재는 의미 없음
tokenRouter.post('/unlockwallet', async (req, res) => {
    console.log(req.body.walletPW);
    try {
        data = {
            walletPW: req.body.walletPW,
            walletAddr: req.session.user.userWallet
        }
        await web3js.unlockWallet(data);
    } catch (err) {
        console.log(err);
    }
})


module.exports = tokenRouter;
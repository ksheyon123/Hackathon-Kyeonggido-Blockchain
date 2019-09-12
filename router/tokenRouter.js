var express = require('express');
var tokenRouter = express.Router();

var web3js = require('../model/web3');
var userModel = require('../model/userModel');

tokenRouter.get('/buytoken', (req, res) => {
    data = {
        userData: req.session.user
    }
    res.render('token/buytoken.html', {data:data})
});

tokenRouter.post('/buytoken', async(req, res) => {
    try {
        var token = req.body.token * 1000000000000000000;
        data = {
            userData: req.session.user,
            userMoney: token
        }
        var result = await web3js.sendTokenFromAdmin(data);
        console.log(result);
        res.redirect('/')
    } catch (err) {
        console.log(err);
    }
});


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
            var result = await web3js.sendToken(data);

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
            walletPW : req.body.walletPW,
            walletAddr : req.session.user.userWallet
        }
        var result = await web3js.unlockWallet(data);
        console.log('unlock data', result);
        res.redirect('/');
    } catch(err) {
        console.log(err);
    }
})


module.exports = tokenRouter;
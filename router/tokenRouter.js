var express = require('express');
var tokenRouter = express.Router();

var web3js = require('../model/web3');

tokenRouter.get('/buytoken', (req, res) => {
    data = {
        userData: req.session.user
    }
    res.render('token/buytoken.html', {data:data})
})


tokenRouter.post('/buytoken', async(req, res) => {
    try {
        var token = req.body.token * 1000000000000000000;
        data = {
            userWallet: req.session.user.userWallet,
            userMoney: token
        }
        await web3js.sendToken(data);
    } catch (err) {
        console.log('죽여줘....');
    }
})


module.exports = tokenRouter;
var express = require('express');
var tokenRouter = express.Router();

var web3js = require('../model/web3');

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



module.exports = tokenRouter;
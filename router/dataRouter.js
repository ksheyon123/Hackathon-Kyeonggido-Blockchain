var express = require('express');
var dataRouter = express.Router();

//Module Import
var dataModel = require('../model/dataModel');
var userModel = require('../model/userModel');
var web3js = require('../model/web3');

dataRouter.get('/itemup', async (req, res) => {
    try {
        var result = await dataModel.categorySelect();
        console.log(result[0]);
        data = {
            userData: req.session.user,
            cateData: result[0]
        }
        res.render('items/itemup.html', { data: data });
    } catch (err) {
        console.log('itemup Err');
    }

});

dataRouter.post('/itemregister', async (req, res) => {
    console.log(req.body);
    try {
        var result = await dataModel.itemup(req);
        res.redirect('/');
    } catch (err) {
        console.log('itemup', err);
    }
});

dataRouter.get('/shop', async (req, res) => {
    try {
        var cateResult = await dataModel.categorySelect();
        var dataResult = await dataModel.selectAllItem();
        data = {
            userData: req.session.user,
            itemData: dataResult[0],
            cateData: cateResult[0]
        }
        res.render('items/shop.html', { data: data });
    } catch (err) {
        console.log('selectAllItem Err', err);
    }

});

dataRouter.post('/shop_sub', async (req, res) => {
    try {
        var result = await dataModel.matchcategory(req);
        res.status(200).send(result);
    } catch (err) {
        console.log('shop_sub Err');
        res.status(500).send('Err');
    }
});

dataRouter.post('/item_detail', async (req, res) => {
    try {
        result = JSON.parse(req.body.data);
        data = {
            userData: req.session.user,
            itemData: result
        }
        res.render('items/showitem_detail.html', { data: data });
    } catch (err) {
        console.log('item_detail Err', err);
    }
});

dataRouter.post('/contract', async (req, res) => {
    try {
        var data = JSON.parse(req.body.data);
        data = {
            userData: req.session.user,
            itemData: data
        }
        //seller Wallet Balance 호출
        var result = await userModel.CallBuyerWalletBalance(data);


        //Comparing buyerBalance with item_price(0 : lack of Balance, )
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

module.exports = dataRouter;
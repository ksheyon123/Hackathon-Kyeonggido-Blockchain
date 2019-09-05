var express = require('express');
var dataRouter = express.Router();

//Module Import
var dataModel = require('../model/dataModel');

dataRouter.get('/itemup', async (req, res) => {
    try {
        var result = await dataModel.categorySelect();
        console.log(result[0]);
        data = {
            userData: req.session.user,
            cateData: result[0]
        }
        res.render('items/itemup.html',{data:data});
    } catch(err) {
        console.log('itemup Err');
    }

});

dataRouter.post('/itemregister', async(req, res)=> {
    console.log(req.body);
    try {
        var result = await dataModel.itemup(req);
        res.redirect('/');
    } catch(err) {
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
        res.render('items/shop.html', {data: data});
    } catch(err) {
        console.log('selectAllItem Err', err);
    }
    console.log('shop' , req.body)
});

dataRouter.post('/item_detail', async (req, res) => {
    console.log('item_detail', req.body)
    try {
            data = {
                itemData: JSON.parse(req.body.data)
            }
        res.render('showitem_detail',{data:data} );
    } catch(err) {
        console.log('item_detail Err');
    }
});

dataRouter.post('/shop_sub', async (req, res) => {
    console.log('shop_sub', req.body)
    try {
        var result = dataModel;
    } catch(err) {
        console.log('shop_sub Err');
    }
});

module.exports = dataRouter;
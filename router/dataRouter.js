var express = require('express');
var dataRouter = express.Router();

//Module Import
var dataModel = require('../model/dataModel');

dataRouter.get('/itemup',(req, res) => {

    res.render('items/itemup.html');
});

dataRouter.post('/itemregister', async(req, res)=> {
    try {
        var result = await dataModel.itemup(req);
        res.redirect('/');
    } catch(err) {
        console.log('itemup', err);
    }
});

dataRouter.get('/shop', async (req, res) => {
    try {
        var result = await dataModel.selectAllItem();
        data = {
            userData: req.session.user,
            itemData: result[0],
        }
        res.render('items/shop.html', {data: data});
    } catch(err) {
        console.log('selectAllItem Err', err);
    }
});

module.exports = dataRouter;
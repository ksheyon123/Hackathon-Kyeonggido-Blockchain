var express = require('express');
var dataRouter = express.Router();

//Module Import
var dataModel = require('../model/dataModel');
var web3js = require('../model/web3');

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
    
});

dataRouter.post('/shop_sub', async (req, res) => {
    try {
        var result = await dataModel.matchcategory(req);
        res.status(200).send(result);
    } catch(err) {
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
        res.render('items/showitem_detail.html',{data:data} );
    } catch(err) {
        console.log('item_detail Err', err);
    }
});

dataRouter.post('/contract', async (req, res) => {
    try {
        console.log(JSON.parse(req.body.data));
        res.send(JSON.parse(req.body.data));
        //req.body 로 상품 정보 load, 
        //contract 함수로 사용자 월렛(이더 매핑)에서 돈 정보 Load
        //결제 가능/불가능 확인
        //결제 가능시 상품 status 변경 (상품 결제 대기)
        //고객이 물건 수령후 결제 내역 창에서 확인 클릭/기간 지나면 고객 월렛에서 판매자 월렛으로 돈 이동
    } catch(err) {
        throw err;
    }
});



module.exports = dataRouter;
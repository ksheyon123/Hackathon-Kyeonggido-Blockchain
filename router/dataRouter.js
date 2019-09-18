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
        itemData = JSON.parse(req.body.data);
        console.log('itemDetail', itemData);
        var itemCode = itemData.item_code
        //item_Code를 바탕으로 Item 정보 호출
        var result = await dataModel.selectAllItemBasedOnItemCode(itemCode);
        console.log('result', result[0][0]);
        solditem = {
            userID : req.session.user.userID,
            itemCode :  itemCode
        }
        //solditem info의 status 가 0이면 댓글 미작성, 1 이면 작성완료 상태
        var status = await dataModel.showSolditemStatus(solditem);
        console.log('status :', status);

        //상품에 대한 Comment 호출
        var comment = await dataModel.selectAllComment(itemCode);
        console.log('comment : ', comment[0])
        data = {
            userData: req.session.user,
            itemData: result[0][0],
            commentData : comment[0],
            statusData: status
        }
        res.render('items/showitem_detail.html', { data: data });
    } catch (err) {
        console.log('item_detail Err', err);
    }
});

dataRouter.get('/myshop', async (req, res) => {
    try {
        var result = await dataModel.selectAllItemBasedOnUserId(req.session.user.userID);
        //내 상품 전체 load -> user 로 , inc 정보 , item 정보 
        //Item Edit 기능
        data = {
            userData: req.session.user,
            itemData: result[0]
        }
        res.render('items/myitemlist.html', { data: data });
    } catch (err) {

    }
});

dataRouter.post('/editmyitem', (req, res) => {

        var result = JSON.parse(req.body.data);
        data = {
            userData: req.session.user,
            itemData: result
        }
        res.render('items/myitemedit.html', {data:data})
});



dataRouter.post('/editconfirm', async (req, res) => {
    try {

    } catch (err) {

    }
});

dataRouter.post('/submitcomment', async (req, res) => {
    try{
        console.log(req.body);
        data = {
            itemCode: req.body.itemCode,
            itemData: req.body.itemData,
            textarea: req.body.textarea,
            userData: req.session.user.userID
        }
        var result = await dataModel.insertComment(data);
        
    } catch (err) {
        console.log('submitcomment router Err', err);
    }
});

module.exports = dataRouter;
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
        console.log(req.body.data);
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
        console.log('comment : ', comment)
        data = {
            userData: req.session.user,
            itemData: result[0][0],
            commentData : comment,
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

dataRouter.post('/submitcomment', async (req, res) => {
    try{
        console.log('/submitComment', req.body);
        data = {
            itemCode: req.body.itemCode,
            itemData: req.body.dataindex,
            textarea: req.body.textarea,
            userData: req.session.user.userID
        }
        var result = await dataModel.insertComment(data);
        console.log('/submitComment result : ', result);
        if(result == 0) {
            var result = await dataModel.changeSoldItemStatustoOne(data);
            //result = 0 문제 없이 solditem status 변경
            res.status(200).send(true);
        } else {
            res.redirect('/item_detail');
        }
    } catch (err) {
        console.log('submitcomment router Err', err);
    }
});

dataRouter.post('/purchaseconfirm', async (req, res) => {
    try {
        //if you click purchaseconfirm button then req.body = {id(of item), confirm (0)}, if not req.body = {id, confirm (1)}
        console.log('/purchaseconfirm', req.body);
        //req.body.confirm 0 => 구매 확정
        //req.body.confirm 1 => 구매 취소
        var confirmData = await web3js.finalConfirmation(req.body);
        console.log('confirmData : ', confirmData);
        var ableToken = await web3js.sendAccountInfo(req.session.user.userWallet);
        req.session.user.userBalance = ableToken;
        if(confirmData == 0) {
            console.log('result=0');
            await dataModel.changeSoldItemStatustoTwo(req.body)
            res.redirect('/');
        } else if (confirmData = 1) {
            console.log('result=1');
            await dataModel.deleteItemFromSolditem(req.body);
            res.redirect('/');
        }
    } catch (err) {
        console.log('Purchase Router Err', err);
    }
});

module.exports = dataRouter;
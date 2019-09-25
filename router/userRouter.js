var express = require('express');
var userRouter = express.Router();

//Session Data Form
const session = require('express-session');
const FileStore = require('session-file-store')(session);

userRouter.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
}));

//Model Import
var userModel = require('../model/userModel');
var dataModel = require('../model/dataModel');
var web3js = require('../model/web3');

// userRouter.get('/', async (req, res) => {
//     try {
//         var result = await dataModel.selectTop3Item();
//         data = {
//             userData: req.session.user,
//             itemCode: result
//         }
//         res.render('index.html', { data: data });
//     } catch (err) {
//         console.log(err);
//     }
// });

userRouter.get('/', async (req, res) => {
    try {
        var result = await dataModel.selectTop8Item();
        var recentItem = await dataModel.selectRecentProductItem();
        var lowPriceItem = await dataModel.selectlowPriceItem();
        var bestItem = await dataModel.selectBestTopItem();
        var recentSellerInc = await dataModel.selectRecentSellerInc();
        data = {
            userData: req.session.user,
            recentItemCode: recentItem,
            topItemCode: result,
            lowPriceCode: lowPriceItem,
            bestCode: bestItem,
            recentSellerIncCode: recentSellerInc
        }
        res.render('index.html', { data: data });
    } catch (err) {
        console.log(err);
    }
});

//Login(로그인)
userRouter.get('/login', async (req, res) => {
    res.render('login.html');
});

//Login Confirm
userRouter.post('/loginConfirmation', async (req, res) => {
    try {
        console.log(req.body);
        var result = await userModel.login(req);
        console.log('loginresult', result[0][0]);
        if (result[0].length > 0) {
            var accountsInfo = await web3js.sendAccountInfo(result[0][0].wallet);
            console.log('accountsInfo', accountsInfo);
            req.session.user = {
                userIndex: result[0][0].index,
                userID: result[0][0].user,
                userPW: result[0][0].password,
                userName: result[0][0].name,
                userAddr: result[0][0].address,
                userPN: result[0][0].phonenumber,
                userDN: result[0][0].dnum,
                userWallet: result[0][0].wallet,
                userStatus: result[0][0].status,
                userBalance: accountsInfo
            }
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('LOGIN_FAILED');
    }
});

//Register(회원가입)
userRouter.get('/register', (req, res) => {
    res.render('register.html');
});

userRouter.post('/registerConfirmation', async (req, res) => {
    try {
        var result = await userModel.register(req);
        //eth.accounts 생성 function
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('LOGIN_FAILED');
    }

});

//Logout(로그아웃)
userRouter.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            console.log('failed: ' + err);
            return;
        });
        console.log('success');
        res.status(200).redirect('/');
    } else return;
});

//myinfo(내 정보)
userRouter.get('/myinfo', (req, res) => {
    data = {
        userData: req.session.user
    }
    res.render('myinfo.html', { data: data });
});

//myinfo_detail(내 정보 변경)
userRouter.get('/myinfo_detail', (req, res) => {
    data = {
        userData: req.session.user
    }
    res.render('myinfo_detail.html', { data: data })
});

//myinfo_detail (변경 사항) -> 수정필요 신상 변경 내역이 바로 반영 x
userRouter.post('/myinfo_detail', async (req, res) => {
    try {
        var result = await userModel.myinfoChange(req);
        res.redirect('/');
    } catch (err) {
        console.log('myinfoChange_Err');
    }


});

//판매자 전환
userRouter.get('/tobeseller', async (req, res) => {
    data = {
        userData: req.session.user
    }
    res.render('tobeseller.html', { data: data });
});

//판매자 전환 대기상태
userRouter.post('/sellerconfirmation', async (req, res) => {
    try {
        var result = await userModel.tobeseller(req);
        if (result == 1) {
            res.redirect('/myinfo');
        } else if (result == 2) {
            res.redirect('/');
        } else {
            res.redirect('/')
        }
    } catch (err) {
        console.log(err);
    }
});

//관리자 접근
userRouter.get('/sellerconfirm', async (req, res) => {
    try {
        var result = await userModel.adminConfirm();
        var incresult = await userModel.selectInc();
        data = {
            userData: req.session.user,
            regiData: result[0],
            incData: incresult[0]
        }
        console.log(data);
        res.render('admin.html', { data: data });
    } catch (err) {
        console.log(err);
        console.log('admin Err');
    }
});

userRouter.post('/sellerconfirm', async (req, res) => {
    try {
        var result = await userModel.adminConfirm();
        var incresult = await userModel.selectInc();
        data = {
            userData: result,
            incData: incresult
        }
        var result = await userModel.beingSellerComplete(req.body.id);
        res.redirect('/sellerconfirm');
    } catch (err) {
        console.log(err);
        console.log('admin post Err');
    }
});


userRouter.get('/transactioninfo', async (req, res) => {
    try {
        var result = await userModel.CallBoughtItemData(req.session.user.userID);
        data = {
            userData: req.session.user,
            solditemData: result[0]
        }
        res.render('items/transactioninfo.html', { data: data });
    } catch (err) {
        console.log('transaction Err');
    }
});




module.exports = userRouter;
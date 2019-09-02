var express = require('express');
var router = express.Router();

const session = require('express-session');
const FileStore = require('session-file-store')(session);

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
}));

var userModel = require('../model/userModel');

router.get('/', function (req, res) {
    data = {
        userData: req.session.user
    }
    res.render('index.html',{data:data});
});

router.get('/login', async (req, res) => {   
    res.render('login.html');
});

router.post('/loginConfirmation', async (req, res) => {

    try {
        var result = await userModel.selectOneByUser(req);
        if(result[0].length > 0) {
            req.session.user = {
                userID : req.body.userID,
                userPW : req.body.userPW
            }
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('LOGIN_FAILED');
    }

})

router.get('/register', (req, res) => {
    res.render('register.html');
});

router.get('/logout', (req, res) => {
    if(req.session.user) {
        req.session.destroy(err => {
            console.log('failed: ' + err);
            return;
        });
        console.log('success');
        res.status(200).redirect('/');
    } else return;
});



module.exports = router;
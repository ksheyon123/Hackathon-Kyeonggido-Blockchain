var express = require('express');
var router = express.Router();
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);

// router.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     store: new FileStore(),
// }));

var mysql = require('mysql');
var myConnection = mysql.createConnection(require('../loginConfig'));

myConnection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});


// const template = require('../components/Template');
// const topbar = require('../components/TopBar');



router.get('/', function (req, res) {
    res.render('index.html');
});

var userModel = require('../model/userModel');

router.get('/login', (req, res) => {
    res.render('login.html');
});

router.post('/loginConfirmation', async (req, res) => {
    try {
        console.log('---------------------------------------------------');
        var result = await userModel.selectOneByUser(req);
        console.log(result)
        res.status(200).send('LOGIN_SUCCESS');

    } catch (err) {
        res.status(500).send('sss');
    }

})



module.exports = router;
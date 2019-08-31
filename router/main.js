var express = require('express');
var router = express.Router();


const template = require('../components/Template');

router.get('/', function(req, res) {
    //Login Template
    //Home Banner
    //Category Link
    //Premium Item Link
    console.log('/1');
    template.mainTemplate().then(function (data) {
        console.log('/2');
        res.send(data);
    });

})



module.exports = router;
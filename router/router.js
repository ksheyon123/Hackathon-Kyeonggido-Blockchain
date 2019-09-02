var express = require('express');
var router = express.Router();

const userRouter = require('./userRouter');

router.use(userRouter);


module.exports = router;
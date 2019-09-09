var express = require('express');
var router = express.Router();

const userRouter = require('./userRouter');
const dataRouter = require('./dataRouter');
const tokenRouter = require('./tokenRouter');

router.use(userRouter);
router.use(dataRouter);
router.use(tokenRouter);

module.exports = router;
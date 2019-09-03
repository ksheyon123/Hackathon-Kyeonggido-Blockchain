var express = require('express');
var router = express.Router();

const userRouter = require('./userRouter');
const dataRouter = require('./dataRouter');

router.use(userRouter);
router.use(dataRouter);

module.exports = router;
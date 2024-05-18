const { SendMoney} = require('../services/payment.service');;

const router = require('express').Router();

router.post('/SendMoney', SendMoney);

module.exports = router
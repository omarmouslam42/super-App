const { ConfirmRequestToPay, RequestToPay, getAllRequestToPay } = require('../services/requestToPay.service.js');
const router = require('express').Router();
router.post('/RequestToPay', RequestToPay);
router.post('/confirmRequestToPay', ConfirmRequestToPay);
router.get('/getAllRequestToPay', getAllRequestToPay);

module.exports = router
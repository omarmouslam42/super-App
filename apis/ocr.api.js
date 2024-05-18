const { createOcrUrl, updateOcrUrl, getOcrUrl } = require('../services/ocr.service')

const router = require('express').Router();


// Route to create a new OCR URL
router.post('/createOcrUrl', createOcrUrl);

// Route to update an existing OCR URL
router.put('/updateOcrUrl', updateOcrUrl);

// Route to get an OCR URL by ID
router.get('/getOcrUrl', getOcrUrl);

module.exports = router
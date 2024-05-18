const mongoose = require('mongoose');

// Define the user schema
const ocrSchema = new mongoose.Schema({
    ocrUrl: {
        type: String,
    },
});

// Create the User model
const ocrModel = mongoose.model('OCR', ocrSchema);

module.exports.ocrModel = ocrModel;

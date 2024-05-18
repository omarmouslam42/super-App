const { ocrModel } = require("../models/ocr.model");

// Create a new OCR URL
module.exports.createOcrUrl = async (req, res) => {
    try {
        const newOcr = new ocrModel({
            ocrUrl: req.body.ocrUrl
        });
        await newOcr.save();
        res.status(201).send(newOcr);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

// Update the most recent OCR URL
module.exports.updateOcrUrl = async (req, res) => {
    try {
        const latestOcr = await ocrModel.findOne().sort({ createdAt: -1 });
        if (!latestOcr) {
            return res.status(404).send({ message: 'No OCR URL found to update' });
        }
        latestOcr.ocrUrl = req.body.ocrUrl;
        await latestOcr.save();
        res.send(latestOcr);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

// Get the most recent OCR URL
module.exports.getOcrUrl = async (req, res) => {
    try {
        const latestOcr = await ocrModel.findOne().sort({ createdAt: -1 });
        if (!latestOcr) {
            return res.status(404).send({ message: 'No OCR URL found' });
        }
        res.send(latestOcr);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

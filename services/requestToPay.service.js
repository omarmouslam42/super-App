const RequestToPayModel = require('../models/requestToPay.model');
const PaymentModel = require('../models/payment.model');
const { UserModel } = require('../models/user.model');

module.exports.RequestToPay = async (req, res) => {
    const { requesterNationalID, recipientNationalID, requestAmount, transactionPurpose } = req.body;
    try {
        // Fetch the payer and recipient
        const requester = await UserModel.findOne({ userNationalID: requesterNationalID });
        const recipient = await UserModel.findOne({ userNationalID: recipientNationalID });

        if (!requester) {
            return res.status(404).json({ error: 'Payer not found' });
        }
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        // Create and save the payment document
        const request = new RequestToPayModel({
            requesterNationalID,
            recipientNationalID,
            requestAmount,
            transactionPurpose,

        });

        await request.save();

        // Return the created payment
        res.status(201).json(request);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.ConfirmRequestToPay = async (req, res) => {

    const { requestId } = req.body;
    try {
        const request = await RequestToPayModel.findById(requestId);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.isConfirmed) {
            return res.status(400).json({ error: 'Request is already confirmed' });
        }

        const payer = await UserModel.findOne({ userNationalID: request.recipientNationalID });
        const recipient = await UserModel.findOne({ userNationalID: request.requesterNationalID });

        if (!payer) {
            return res.status(404).json({ error: 'Recipient (payer) not found' });
        }
        if (!recipient) {
            return res.status(404).json({ error: 'Requester (recipient) not found' });
        }

        // Check if the payer has sufficient balance
        if (payer.userBalance < request.requestAmount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Modify the balances
        payer.userBalance -= request.requestAmount;
        recipient.userBalance += request.requestAmount;

        // Save the updated user documents
        await payer.save();
        await recipient.save();

        // Create and save the payment document
        const payment = new PaymentModel({
            payerNationalID: payer.userNationalID,
            recipientNationalID: recipient.userNationalID,
            transferAmount: request.requestAmount,
            transactionPurpose: request.transactionPurpose,
            isRequest: true
        });

        await payment.save();

        // Update the RequestToPay document
        request.isConfirmed = true;
        request.paymentId = payment._id;
        await request.save();

        // Return the created payment
        res.status(201).json(payment);
    } catch (error) {
        console.error('Error confirming request to pay:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.getAllRequestToPay = async (req, res) => {
    try {
        const requests = await RequestToPayModel.find()

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
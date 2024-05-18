const PaymentModel = require('../models/payment.model');
const { UserModel } = require('../models/user.model');

module.exports.SendMoney = async (req, res) => {
    const { payerNationalID, recipientNationalID, transferAmount, transactionPurpose } = req.body;

    try {
        // Fetch the payer and recipient
        const payer = await UserModel.findOne({ userNationalID: payerNationalID });
        const recipient = await UserModel.findOne({ userNationalID: recipientNationalID });

        if (!payer) {
            return res.status(404).json({ error: 'Payer not found' });
        }
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        // Check if the payer has sufficient balance
        if (payer.userBalance < transferAmount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Modify the balances
        payer.userBalance -= transferAmount;
        recipient.userBalance += transferAmount;

        // Save the updated user documents
        await payer.save();
        await recipient.save();

        // Create and save the payment document
        const payment = new PaymentModel({
            payerNationalID,
            recipientNationalID,
            transferAmount,
            transactionPurpose,
            // False
        });

        await payment.save();

        // Return the created payment
        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
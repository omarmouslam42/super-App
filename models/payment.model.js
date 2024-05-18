const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
    payerNationalID: {
        type: String,
        required: true,
        ref: 'User' // Assuming this references the User model's mobile number
    },
    recipientNationalID: {
        type: String,
        required: true,
        ref: 'User' // Assuming this references the User model's mobile number
    },
    transferAmount: {
        type: Number,
        required: true
    },
    transactionPurpose: {
        type: String,
        enum: ['Purchase', 'Bill Payment', 'Transfer', 'Donation'], // Example purposes
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now() + 2 * 60 * 60 * 1000, // Current date + 2 hours
    },
    isRequest: {
        type: Boolean,
        default: false
    }
});

// Create a Payment model
const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;
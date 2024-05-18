const mongoose = require('mongoose');

// Define the RequestToPay schema
const requestToPaySchema = new mongoose.Schema({
    requesterNationalID: {
        type: String,
        required: true,
        ref: 'User'
    },
    recipientNationalID: {
        type: String,
        required: true,
        ref: 'User'
    },
    requestAmount: {
        type: Number,
        required: true
    },
    transactionPurpose: {
        type: String,
        enum: ['Purchase', 'Bill Payment', 'Transfer', 'Donation'], // Example purposes
        required: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },

    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment' // Reference to the Payment model
    },
    createdAt: {
        type: Date,
        default: () => Date.now() + 2 * 60 * 60 * 1000, // Current date + 2 hours
    },
});

// Create a RequestToPay model
const RequestToPayModel = mongoose.model('RequestToPay', requestToPaySchema);

module.exports = RequestToPayModel;

const mongoose = require('mongoose');


// Define the organization schema
const organizationSchema = new mongoose.Schema({
    licenseId: {
        type: String,
    },
    orgStatus: {
        type: Boolean,
        default: true
    },
    organizationType: {
        type: [String]  
    },
    organizationName: {
        type: String,
    },
    organizationFinancialId: {
        type: String
    },
    financialLimitFrom: {
        type: Number
    },
    financialLimitTo: {
        type: Number
    },
    bankAccount: {
        type: Number
    },
    organizationAttachments: {
        type: [String] // Assuming attachments are stored as array of file paths
    }
});

// Create the Organization model
const OrganizationModel = mongoose.model('Organization', organizationSchema);

module.exports.OrganizationModel = OrganizationModel;
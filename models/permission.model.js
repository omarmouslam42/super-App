const mongoose = require('mongoose');

// Define the permission schema
const permissionSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
    },
    organizationName: {
        type: String,
    },
    userStatus: {
        type: Boolean,
        default: true
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    organizationAdmin: {
        type: Boolean,
        default: false
    },
    merchant: {
        type: Boolean,
        default: false
    },
    serviceAgent: {
        type: Boolean,
        default: false
    },
    fieldAgent: {
        type: Boolean,
        default: false
    },
    inventoryWorker: {
        type: Boolean,
        default: false
    },
    consumer: {
        type: Boolean,
        default: false
    }
});

// Create the Permission model
const PermissionModel = mongoose.model('Permission', permissionSchema);

module.exports.PermissionModel = PermissionModel;

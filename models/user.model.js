const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming Organization ID is stored as MongoDB ObjectID
        ref: 'Organization', // Reference to Organization model
    },
    organizationName: {
        type: String, 
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming Permission ID is stored as MongoDB ObjectID
        ref: 'Permission', // Reference to Permission model
    },
    userStatus: {
        type: Boolean,
        default: true // Assuming user status defaults to true (active)
    },
    businessUserId: {
        type: Number, // Assuming Business User ID is stored as a number
    },
    username: {
        type: String,
    },
    userPassword: {
        type: String,
    },
    userMobileNumber: {
        type: String, // Assuming User Mobile Number is stored as a string
    },
    userNationalID: {
        type: String, // Assuming User National ID is stored as a string
        unique: true,
    },
    userEmail: {
        type: String,
        unique: true,
    },
    lastLoginAt: {
        type: Date,
    }
});

// Create the User model
const UserModel = mongoose.model('User', userSchema);

module.exports.UserModel = UserModel;

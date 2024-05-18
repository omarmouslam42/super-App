const { UserModel } = require("../models/user.model");
const { PermissionModel } = require('../models/permission.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports.createNewUser = async (req, res) => {
    try {
        // Extract user data from the request body
        const {
            organizationId,
            organizationName,
            userStatus,
            businessUserId,
            username,
            userPassword,
            userMobileNumber,
            userNationalID,
            userEmail,
            // Extract permission data from the request body as a separate object
            permission: {
                superAdmin,
                organizationAdmin,
                merchant,
                serviceAgent,
                fieldAgent,
                inventoryWorker,
                consumer
            }
        } = req.body;

        // Check if a user with the provided email or mobile number already exists
        const existingUser = await UserModel.findOne({
            $or: [{ userEmail: userEmail }, { userNationalID: userNationalID }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new permission document
        const newPermission = new PermissionModel({
            organizationId,
            organizationName,
            userStatus,
            superAdmin,
            organizationAdmin,
            merchant,
            serviceAgent,
            fieldAgent,
            inventoryWorker,
            consumer
        });

        // Save the permission to the database
        const savedPermission = await newPermission.save();
        
        // Create a new user document
        const hashedPassword = await bcrypt.hash(userPassword, 5);
        const newUser = new UserModel({
            organizationId,
            organizationName,
            permissionId: savedPermission._id, // Assign the generated permission ID
            userStatus,
            businessUserId,
            username,
            userPassword: hashedPassword,
            userMobileNumber,
            userNationalID,
            userEmail
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Respond with the saved user document
        res.status(200).json({ createdUser: savedUser });
    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.checkUserByNationalID = async (req, res) => {
    try {
        const user = await UserModel.findOne({ userNationalID: req.body.userNationalID });

        if (user) {
            res.json({ exists: true, user });
        } else {
            res.json({ exists: false, message: 'User not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.signIn = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ userEmail }).populate('permissionId');

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // Generate JWT token
        const token = jwt.sign({
            _id: user._id,
        }, process.env.TOKENSECRITKEY);

        // Update the lastLoginAt field
        user.lastLoginAt = new Date();

        // Save the user document with updated lastLoginAt field
        await user.save();

        // Return success message along with token and user details
        return res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error('Error during signIn:', error); // Log the error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Endpoint to get user by national ID
module.exports.getUserByNationalId = async (req, res) => {
    try {
        const { userNationalID } = req.params;

        const userId = req._id; // Adjust this according to your authentication setup

        // Check if the user has super admin permission
        const userThatSearch = await UserModel.findById(userId);
        if (!userThatSearch) {
            return res.status(401).json({ error: 'Unauthorized: User Unauthorized to search' });
        }
        
        // Find the user by national ID
        const user = await UserModel.findOne({ userNationalID }).populate('permissionId');

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user details
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user by national ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Endpoint to get user by email
module.exports.getUserByEmail = async (req, res) => {
    try {
        const { userEmail } = req.params;
        
        const userId = req._id; // Adjust this according to your authentication setup

        // Check if the user has super admin permission
        const userThatSearch = await UserModel.findById(userId);
        if (!userThatSearch) {
            return res.status(401).json({ error: 'Unauthorized: User Unauthorized to search' });
        }

        // Find the user by email
        const user = await UserModel.findOne({ userEmail }).populate('permissionId');

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user details
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Update organizationId for a user
module.exports.updateOrganizationId = async (req, res) => {
    try {
        const { organizationId } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { organizationId }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating organizationId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update organizationName for a user
module.exports.updateOrganizationName = async (req, res) => {
    try {
        const { organizationName } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { organizationName }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating organizationName:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.updatePermissions = async (req, res) => {
    try {
        // Extract permission fields from the request body
        const { superAdmin, organizationAdmin, merchant, serviceAgent, fieldAgent, inventoryWorker, consumer } = req.body;

        // Fetch the user document based on the user's ID (req._id)
        const user = await UserModel.findById(req._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch the permission document based on the user's permissionId
        const permission = await PermissionModel.findById(user.permissionId);

        if (!permission) {
            return res.status(404).json({ error: 'Permission not found' });
        }

        // Update permission fields based on the request body
        permission.superAdmin = superAdmin || permission.superAdmin;
        permission.organizationAdmin = organizationAdmin || permission.organizationAdmin;
        permission.merchant = merchant || permission.merchant;
        permission.serviceAgent = serviceAgent || permission.serviceAgent;
        permission.fieldAgent = fieldAgent || permission.fieldAgent;
        permission.inventoryWorker = inventoryWorker || permission.inventoryWorker;
        permission.consumer = consumer || permission.consumer;

        // Save the updated permission document
        await permission.save();

        res.status(200).json({ message: 'Permissions updated successfully', user });
    } catch (error) {
        console.error('Error updating permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Update user status for a user
module.exports.updateUserStatus = async (req, res) => {
    try {
        const { userStatus } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { userStatus }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating userStatus:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update businessUserId for a user
module.exports.updateBusinessUserId = async (req, res) => {
    try {
        const { businessUserId } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { businessUserId }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating businessUserId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update username for a user
module.exports.updateUsername = async (req, res) => {
    try {
        const { username } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { username }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update userPassword for a user
module.exports.updateUserPassword = async (req, res) => {
    try {
        const { userPassword } = req.body;
        // Create a new user document
        const hashedPassword = await bcrypt.hash(userPassword, 5);
        const user = await UserModel.findByIdAndUpdate(req._id, { hashedPassword }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating userPassword:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update userMobileNumber for a user
module.exports.updateUserMobileNumber = async (req, res) => {
    try {
        const { userMobileNumber } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { userMobileNumber }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating userMobileNumber:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update userNationalID for a user
module.exports.updateUserNationalID = async (req, res) => {
    try {
        const { userNationalID } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { userNationalID }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating userNationalID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update userEmail for a user
module.exports.updateUserEmail = async (req, res) => {
    try {
        const { userEmail } = req.body;

        const user = await UserModel.findByIdAndUpdate(req._id, { userEmail }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating userEmail:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
        .populate('permissionId')
        .populate('organizationId');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const { OrganizationModel } = require("../models/organization.model")
const { UserModel } = require("../models/user.model");


module.exports.createNewOrganization = async (req, res) => {
    try {

        // Extract user ID from request (assuming it's available after authentication)
        const userId = req._id; // Adjust this according to your authentication setup

        // Check if the user has super admin permission
        const user = await UserModel.findById(userId).populate('permissionId');
        if (!user || !user.permissionId || !user.permissionId.superAdmin) {
            return res.status(401).json({ error: 'Unauthorized: User does not have super admin permission' });
        }

        // Extract organization data from the request body
        const {
            licenseId,
            orgStatus,
            organizationType,
            organizationName,
            organizationFinancialId,
            financialLimitFrom,
            financialLimitTo,
            bankAccount,
            organizationAttachments
        } = req.body;

        // Check if the organization name already exists
        const existingOrganization = await OrganizationModel.findOne({ organizationName });
        if (existingOrganization) {
            return res.status(400).json({ error: 'Organization name already exists' });
        }

        // Create a new organization document
        const newOrganization = new OrganizationModel({
            licenseId,
            orgStatus,
            organizationType,
            organizationName,
            organizationFinancialId,
            financialLimitFrom,
            financialLimitTo,
            bankAccount,
            organizationAttachments
        });

        // Save the organization to the database
        const savedOrganization = await newOrganization.save();

        // Respond with the saved organization document under the key 'createdOrganization'
        res.status(200).json({ createdOrganization: savedOrganization });
    } catch (error) {
        // Handle errors
        console.error('Error creating organization:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getAllOrganizations = async (req, res) => {
    try {
        // Extract user ID from request (assuming it's available after authentication)
        const userId = req._id; // Adjust this according to your authentication setup

        // Check if the user has super admin permission
        const user = await UserModel.findById(userId).populate('permissionId');
        if (!user || !user.permissionId || !user.permissionId.superAdmin) {
            return res.status(401).json({ error: 'Unauthorized: User does not have super admin permission' });
        }
        
        // Fetch all organizations from the database
        const organizations = await OrganizationModel.find();

        // Respond with the list of organizations
        res.status(200).json({ organizations });
    } catch (error) {
        // Handle errors
        console.error('Error fetching organizations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const { auth } = require('../middleware/authentication/auth');
const { createNewUser, signIn, getUserByNationalId, getUserByEmail, updateOrganizationId, updateOrganizationName, updateUserStatus, updateBusinessUserId, updateUsername, updateUserPassword, updateUserMobileNumber, updateUserNationalID, updateUserEmail, updatePermissions, checkUserByNationalID, getAllUsers } = require('../services/user.service')

const router = require('express').Router();

router.post('/signIn', signIn);
router.get("/getAllUsers", getAllUsers);
router.post('/checkUserByNationalID', checkUserByNationalID);
router.post('/createNewUser', createNewUser);
router.get('/getUserByNationalId/:userNationalID', auth, getUserByNationalId); // Updated route to accept parameter
router.get('/getUserByEmail/:userEmail', auth, getUserByEmail); // Updated route to accept parameter
// Route for updating organizationId
router.put('/updateOrganizationId', auth, updateOrganizationId);

// Route for updating organizationName
router.put('/updateOrganizationName', auth, updateOrganizationName);

// Route for updating permissionId
router.put('/updatePermissions', auth, updatePermissions);

// Route for updating userStatus
router.put('/updateUserStatus', auth, updateUserStatus);

// Route for updating businessUserId
router.put('/updateBusinessUserId', auth, updateBusinessUserId);

// Route for updating username
router.put('/updateUsername', auth, updateUsername);

// Route for updating userPassword
router.put('/updateUserPassword', auth, updateUserPassword);

// Route for updating userMobileNumber
router.put('/updateUserMobileNumber', auth, updateUserMobileNumber);

// Route for updating userNationalID
router.put('/updateUserNationalID', auth, updateUserNationalID);

// Route for updating userEmail
router.put('/updateUserEmail', auth, updateUserEmail);

module.exports = router;



const { createNewOrganization, getAllOrganizations } = require('../services/organization.service')
const { auth } = require('../middleware/authentication/auth');

const router = require('express').Router();

router.post('/createNewOrganization', auth, createNewOrganization)
router.get('/getAllOrganizations', auth, getAllOrganizations)

module.exports = router;



const express = require('express');
// const { validation, ctrlWrapper } = require('../../middlewares');
const validateBody = require("../../utils/validateBody");


const ctrl = require('../../controllers/auth');
// const ctrlWrapper = require('../../helpers/ctrlWrapper');

const schemas = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

module.exports = router;
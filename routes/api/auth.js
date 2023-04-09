const express = require('express');

const validateBody = require("../../utils/validateBody");

const {schemas} = require('../../models/user');

const ctrl = require('../../controllers/auth');




const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

module.exports = router;
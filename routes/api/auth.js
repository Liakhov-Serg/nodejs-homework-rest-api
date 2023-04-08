const express = require('express');
// const { validation, ctrlWrapper } = require('../../middlewares');
const {validateBody} = require("../../utils/validateBody");

const schemas = require('../../models/user');

const ctrl = require('../../controllers/auth');
// const ctrlWrapper = require('../../utils/ctrlWrapper');



const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

module.exports = router;
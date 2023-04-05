const express = require('express');
// const { validation, ctrlWrapper } = require('../../middlewares');
// const validateBody = require("../../utils/validateBody");

const ctrl = require('../../controllers/auth');
const ctrlWrapper = require('../../helpers/ctrlWrapper');

const router = express.Router();

router.post('/register', ctrlWrapper(ctrl.register));

module.exports = router;
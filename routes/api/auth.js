const express = require('express');
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.post('/register');

module.exports = router;
const express = require('express');

const validateBody = require("../../utils/validateBody");

const {schemas} = require('../../models/user');

const ctrl = require('../../controllers/auth');

const { authenticate, upload} = require("../../middlewares");


const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.get("/verify/:verificationCode, ctrl.verifyEmail");
router.post("verify", validateBody(schemas.verifySchema), ctrl.resendEmail);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router;
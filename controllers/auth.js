const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
// const { nanoid } = require("nanoid");
const {v4: uuidv4} = require("uuid");

const ctrlWrapper = require('../utils/ctrlWrapper');

const { User } = require('../models/user');

const { HttpError, sendEmail} = require('../helpers');
// const { sendEmail} = require('../helpers/sendEmail');

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const { SECRET_KEY, BASE_URL} = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    // const verificationCode = nanoid();
    const verificationCode = uuidv4();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode});

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click verify email</a>`
    };
    await sendEmail(verifyEmail);

    res.status(201).json({
        subscription: newUser.subscription,
        email: newUser.email,
    });

};
const verifyEmail = async(req, res)=> {
    const {verificationCode} = req.params;
    const user = await User.findOne({verificationCode});
    if(!user) {
        throw HttpError(404, "Email not found");
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""});

    res.json({
        message: "Verify success"
    })
}

const resendEmail = async(req, res)=> {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, "Email not found");
    }
    if(user.verify) {
        throw HttpError(400, "Email already verify");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email resend"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid"); // throw HttpError(401, "Email invalid");
    }

    if (!user.verify) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid"); // throw HttpError(401, "Password invalid");
    }
      const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });

};

const getCurrent = async (req, res) => {
    const { subscription, email } = req.user;
    res.json({
        subscription,
        email,
    })
}
   
const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
        message: "Logout success"
    });
};
const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    
    const result = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
   if (!result) throw HttpError(404, `Not found`);;
   res.json(result);
};

const updateAvatar = async (req, res) => {
    const { path: tempUpload, filename } = req.file;
    const { _id } = req.user;
    const savename = `${_id}_${filename}`;
    const resultUpload = path.join(avatarDir, savename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', savename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendEmail: ctrlWrapper(resendEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ctrlWrapper = require('../utils/ctrlWrapper');

const { User } = require('../models/user');

const HttpError = require('../helpers/HttpError');

const { SECRET_KEY } = process.env;

const register = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    });

}

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password invalid"); // throw HttpError(401, "Email invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid"); // throw HttpError(401, "Password invalid");
    }
    
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn:"23"});
    res.json({
        token,
    })

}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}
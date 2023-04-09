const bcrypt = require('bcrypt');

const ctrlWrapper = require('../utils/ctrlWrapper');

const { User } = require('../models/user');

const HttpError = require('../helpers/HttpError');

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
    
    const token = "23w24.gsfh.4545";
    res.json({
        token,
    })

}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}
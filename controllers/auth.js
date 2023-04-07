const ctrlWrapper = require('../helpers/ctrlWrapper');

const { User } = require('../models/user');

const HttpError = require('../helpers/HttpError');

const register = async (req, res) => {
    const { email} = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
        throw HttpError(409, "Email already exist");
    }

    const newUser = await User.create(req.body);

    res.staus(201).join({
        name: newUser.name,
        email: newUser.email,
    }
    
    
    );

}

module.exports = {
    register: ctrlWrapper(register),
}
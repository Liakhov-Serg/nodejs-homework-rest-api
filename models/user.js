const { Schema, model } = require('mongoose');
const Joi = require('joi');

const userSchema = Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: [true, "Email is required"];
        unique: true

    },
    password: {
        type: String,
        required: true,
        minlength: 6

    },

}, { versionKey: false, timestamps: true });

const joiSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
}

)

const User = model("user", userSchema);

module.exports = {
    User,
    joiSchema
}
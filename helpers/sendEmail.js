const nodemailer = require('nodemailer');
const sendEmail = require('.');
require('dotenv').config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "sa1509sa@meta.ua",
        pass: META_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
    to: "demiwa2402@snowlash.com",
    from: "sa1509sa@meta.ua",
    subject: "Verify email",
    html: "<p>Verify email.</p>"
};
transport.sendMail(email)
    .then(() => console.log("Email send success"))
    .catch(error => console.log(error.message));

module.exports = { sendEmail }


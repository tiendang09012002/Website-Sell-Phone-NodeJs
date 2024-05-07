const nodemailer = require("nodemailer");
const config = require("config");
const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});
module.exports=transporter



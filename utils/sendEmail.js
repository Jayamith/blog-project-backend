const nodemailer = require("nodemailer");
require('dotenv').config;

const sendEmail = async (to, resetToken) => {
  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // create message
    const message = {
      to,
      subject: "Password Reset",
      html: `
            <p> You are receiving this email because you have requested the reset of a password. </p>
            <p> Please click on the following link, or paste this into your browser to complete the process:</p>
            <p> http://localhost:3000/reset-password/${resetToken}</p>
            <p> If you did not request this, please ignore this email and your password will remain unchanged!</p> 
            `,
    };

    // send the email
    const info = await transporter.sendMail(message);
    console.log("Email sent", info.messageId);
  } catch (error) {
    throw new Error("Email Sending Failed!");
  }
};

module.exports = sendEmail;

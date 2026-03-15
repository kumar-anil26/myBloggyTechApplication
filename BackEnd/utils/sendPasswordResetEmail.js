const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//!Load dotenv into process object
dotenv.config();

//@Desc Send email to reset password

const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    //!Create a transport object
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PWD,
      },
    });
    //!Create a message to be send
    const message = {
      to,
      subject: "Password reset Token",
      html: `<h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="http://localhost:5173/reset-password/${resetToken}" style="display:inline-block;padding:10px 20px;
      background:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
       <p>This link will expire in <b>10 minutes</b>.</p>`,
    };

    //!Send the mail
    const info = await transport.sendMail(message);
    console.log("Email send successfully", info.messageId);
  } catch (err) {
    console.log(err);
    throw new Error("Email sending fail!");
  }
};

module.exports = sendPasswordResetEmail;




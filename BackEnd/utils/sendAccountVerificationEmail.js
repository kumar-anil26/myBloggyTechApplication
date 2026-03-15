const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//configure dotenv
dotenv.config();

const sendAccountVerificationEmail = async (to, verificationToken) => {
  try {
    //Create a transport
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PWD, //Gmail app pssword
      },
    });
    //Create Subject
    const message = {
      to,
      subject: "Account Verification Token",
      html: `<h2>Welcome to Our App</h2>
                     <p>Thank you for registering! Please verify your email to activate your account.</p>
                     <a href="${verificationToken}" style="display:inline-block;padding:10px 20px;
                     background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Verify Account</a>
                    <p>If you did not create this account, please ignore this email.</p>
                    <p>This link will expire in <b>1 hours</b>.</p>`,
    };
    //send the Email
    const info = await transport.sendMail(message);
    console.log("Email send Successfully", info.messageId);
  } catch (error) {
    throw new Error("Email sending Failed! ");
  }
};

module.exports = sendAccountVerificationEmail;

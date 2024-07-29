const nodemailer = require("nodemailer");

const EMAIL = process.env.EMAIL;

const PASSWORD = process.env.PASSWORD;

const BASE_URL = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});



  async function mailer(email,token,type) {
   
    
  
    const mailOptions = type === "verification"?
    {
      from: EMAIL,
      to: email, 
      subject: 'Email Verification',
      text: `Click the following link to verify your email: ${BASE_URL}/verification/${token}` // Email body with verification link
    }
    :
    {
      from: EMAIL,
      to: email, 
      subject: 'Reset Password',
      text: `Click the following link to reset your password: ${BASE_URL}/resetpassword/${token}` // Email body with verification link
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully.');
    } catch (error) {
      console.error('Error sending verification email: ', error);
    }
  }

  
  module.exports = mailer;
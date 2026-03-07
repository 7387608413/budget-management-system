const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendEmail(to, subject, text) {

  console.log("Sending email to:", to);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      console.log("Email error:", error);
    } else {
      console.log("Email sent:", info.response);
    }

  });

}

module.exports = sendEmail;
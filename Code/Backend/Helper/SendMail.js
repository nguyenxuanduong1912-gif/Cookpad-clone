let nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SEND_MAIL,
    pass: process.env.PASSWORD_SEND_MAIL,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi:", info.response);
    return info;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw error;
  }
};

module.exports = sendEmail;

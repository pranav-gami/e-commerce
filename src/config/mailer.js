import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: `"E-Commerce Store" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP to Reset Your E-commerce accounts Password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #007bff;">E-commerce Store</h2>
        <p>Dear User,</p>
        <p>We received a request to reset the password for your account associated with this email address.</p>
        <p><strong>Your One-Time Password (OTP) is:</strong></p>
        <h3 style="color: #28a745;">${otp}</h3>
        <p>This OTP is valid for <strong>5 minutes</strong> only.</p>
        <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
        <br/>
        <p>Thank you</p>
      </div>
    `,
  });
}

export default sendOtpEmail;

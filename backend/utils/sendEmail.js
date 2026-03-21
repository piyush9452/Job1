import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // FACT: Configured to use standard SMTP (Gmail is easiest for dev/startups)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // NOTE: If using Gmail, this MUST be an "App Password", not your normal login password.
    },
  });

  const mailOptions = {
    from: `JobOne ATS <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
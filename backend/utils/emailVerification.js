
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter using explicit host and port for better control
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Explicitly set Gmail's SMTP server
    port: 587,              // Use port 587 for TLS
    secure: false,          // false for 587, true for 465
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Optional: Add this if you still get certificate errors, 
    // but try without it first as it lowers security slightly.
    // tls: {
    //    rejectUnauthorized: false
    // }
  });

  // 2. Define email options
  const mailOptions = {
    from: '"Adore Job Portal" <noreply@adorejobportal.com>', // Make this look professional
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
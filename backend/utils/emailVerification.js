import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter (using Gmail as an example)
  // For production, use a real service like SendGrid or Mailgun.
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USERNAME, // Your gmail address
      pass: process.env.EMAIL_PASSWORD, // Your gmail APP PASSWORD (not normal password)
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: '"Job Portal" <no-reply@jobportal.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // You can add HTML versions too
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
const nodemailer = require('nodemailer');
const Course = require('../models/Course');
const User = require('../models/User');

exports.getHomePage = async (req, res) => {
  try {
    const [totalCourses, courses, totalStudents, totalTeachers] =
      await Promise.all([
        Course.find().countDocuments(),
        Course.find().sort({ createdAt: -1 }).limit(2),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'teacher' }),
      ]);

    res
      .status(200)
      .render('index', { courses, totalCourses, totalStudents, totalTeachers });
  } catch (error) {}
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about');
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact');
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register');
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login');
};

exports.sendEmail = async (req, res) => {
  try {
    const receiverEmail = process.env.EMAIL_USER;
    const outputMessage = `
      <h1>Mail Details</h1>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <h1>Message</h1>
      <p>${req.body.message}</p>
  `;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Smart EDU Contact Form" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      replyTo: req.body.email,
      subject: 'Smart EDU Contact Form New Message!',
      html: outputMessage,
    });

    console.log('Message sent: %s', info.messageId);

    // Get the Ethereal URL to preview this email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL: %s', previewUrl);
    // Output: https://ethereal.email/message/...

    req.flash('success', 'We received your message successfully');

    res.status(200).redirect('contact');
  } catch (error) {
    // req.flash('error', `Something went wrong! ${error}`);
    req.flash('error', 'Something went wrong!');
    res.status(200).redirect('contact');
  }
};

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email Already exists'
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign(
      { name, email, password: hashed },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const link = `http://localhost:5000/api/auth/verify/${verificationToken}`;
    await sendEmail(
  email,
  "Verify Your Exam App Registration",
  `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background: #f9f9f9;">
    <h2 style="color: #4CAF50; text-align: center;">Welcome to Exam App 🎓</h2>
    <p style="font-size: 16px; color: #333;">
      Thank you for registering on <b>Exam App</b>, your smart platform for managing exams and results.  
    </p>
    <p style="font-size: 16px; color: #333;">
      Please confirm your account by clicking the button below:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" style="background: #4CAF50; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; font-weight: bold;">
        ✅ Verify My Account
      </a>
    </div>
    <p style="font-size: 14px; color: #777; text-align: center;">
      If the button doesn't work, copy and paste this link into your browser:  
      <br/>
      <a href="${link}" style="color: #4CAF50;">${link}</a>
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #999; text-align: center;">
      © 2025 Exam App. All rights reserved.
    </p>
  </div>
  `
);

    res.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
};


exports.verify = async (req, res) => {
  try {
    const { name, email, password } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('User already verified or exists');

    const user = await User.create({
      name,
      email,
      password,
      isVerified: true, // Directly verified
    });

    res.send('Email verified and account created successfully!');
  } catch (err) {
    console.error('Verification failed:', err.message);
    res.status(400).send('Invalid or expired verification link.');
  }
};


exports.login = async (req, res) => {
  
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  
 if (!user) return res.status(404).send('User not found');
  if (!user.isVerified) return res.status(403).send('Email not verified');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send('Incorrect password');

  const token = jwt.sign({ id: user._id,name: user.name, email: user.email,picture: user.picture }, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true });
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie('token'); // Clear the JWT cookie
  res.send('Logout successful');
};


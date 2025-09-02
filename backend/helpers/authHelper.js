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
  "Verify your email",
  {
    text: `Click the link to verify your email: ${link}`, // plain-text fallback
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 6px; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
          <p style="color: #555; font-size: 15px;">
            Thanks for registering with <strong>Exam App</strong> 🎓. Please confirm your email address to complete your registration.
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${link}" 
               style="background-color: #007BFF; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block; font-weight: bold;">
               Verify Email
            </a>
          </div>
          <p style="color: #777; font-size: 13px; text-align: center;">
            If the button above doesn’t work, copy and paste this link into your browser:
          </p>
          <p style="color: #555; font-size: 13px; word-break: break-word; text-align: center;">
            ${link}
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #aaa; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Exam App. All rights reserved.
          </p>
        </div>
      </body>
    </html>
    `
  }
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


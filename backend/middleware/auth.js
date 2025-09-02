const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adjust path as per your structure

async function getUserFromToken(token) {
  try {
    if (!token) throw new Error("No token provided");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID in token
    const user = await User.findById(decoded.id).lean();
    if (!user) throw new Error("User not found");

    return user;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = getUserFromToken;

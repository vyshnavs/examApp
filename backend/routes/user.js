//importing require modules
const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/user-helpers");
const sessionMiddleware=require("../middleware/sessionMiddleware");

//sign up post request from fontend
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Simulate user registration logic
  if (name && email && password) {
    userHelpers.doSignup(req.body).then(async (response) => {
      console.log(response);

      res.json({ success: true, message: "User created successfully" });
    });
  } else {
    res.json({ success: false, message: "Invalid input data" });
  }
});

//login post request from front end
router.post("/login", (req, res) => {
  if (req.body) {
    userHelpers.doLogin(req.body).then(async (response) => {
      if (response.status) {
        const userName=response.user.email;//using email as user sesion id
        req.session.user = {userName }; // Save user info in session
        res.json({ user:response.user,success: true, message: "User logged in successfully" }); // Send success response
      } else {
        req.session.loginErr = "Invlid username or password!!";
        res.json({ success: false, message: "Invalid username or password" }); // Send error response
      }
    });
  }
});

router.post("/logout", (req, res) => {
  // Clear session or token

  req.session?.destroy(); // For session-based auth
 // Respond to client
  res.status(200).send({ message: "Logged out successfully" });
});


module.exports = router;

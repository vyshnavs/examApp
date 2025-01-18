
const express = require('express');
const router = express.Router();
const adminHelpers=require("../helpers/admin-helpers");
//sign up post request from fontend
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Simulate user registration logic
  if (name && email && password) {
    adminHelpers.doSignup(req.body).then(async (response) => {
      console.log(response);

      res.json({ success: true, message: "User created successfully" });
    });
  } else {
    res.json({ success: false, message: "Invalid input data" });
  }
});
module.exports = router;
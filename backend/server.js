// server.js

const express = require("express");
const db = require("./config/connection");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sessionMiddleware=require("./middleware/sessionMiddleware");

const homeRouter = require("./routes/home");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const examRouter = require("./routes/exam");

// Initialize dotenv to load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
app.use(sessionMiddleware);//creating sessions for the user

// MongoDB connection
db.connect((err) => {
  if (err) console.log("Connection Error" + err);
  else console.log("Databas connected to  port 27017");
});

// Use routes
app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/exam", examRouter);

// Frontend URL, adjust as needed
app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

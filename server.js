const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./userModel");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://Saranya:SARANYA2004@cluster0.6qhlxaw.mongodb.net/?appName=Cluster0")

    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));



// Register API
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });
});


// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, "SECRET123", { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});


// Start server
app.listen(5000, () => console.log("Server started on port 5000"));
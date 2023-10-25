const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());
app.use(cors());

// Define a secure JWT secret. Use environment variables for this purpose.
const JWT_SECRET = "your-secret-key-goes-here";

const mongoUrl = "mongodb+srv://praneshkangeyanse21it:sepk2003@cluster0.uyh6rjw.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => console.log(e));

// Define your user model here or import it as needed

app.post("/register", async (req, res) => {
    const { fname, lname, email, pass } = req.body;
    const encryptedPassword = await bcrypt.hash(pass, 10);

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({ error: "User Exists" }); // Use a proper status code
        }
        await User.create({
            fname,
            lname,
            email,
            pass: encryptedPassword,
        });
        res.json({ status: "ok" });
    } catch (error) {
        res.status(500).json({ status: "error" }); // Use a proper status code
    }
});

app.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ status: "error", error: "User Not Found" });
    }
    if (await bcrypt.compare(pass, user.pass)) {
        const token = jwt.sign({ email: user.email }, JWT_SECRET);
        res.json({ status: "ok", data: token });
    } else {
        res.status(400).json({ status: "error", error: "Invalid Password" });
    }
});

app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        const data = await User.findOne({ email: useremail });
        if (data) {
            res.json({ status: "ok", data });
        } else {
            res.status(400).json({ status: "error", data: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ status: "error", data: error });
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});

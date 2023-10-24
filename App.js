const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

const jwt = require("jsonwebtoken");

const JWT_SECRET = "sdfghjkl;kjhgfdghjkljhgfhjkljhgfh9876546789876578()././.";

const mongoUrl =
  "mongodb+srv://pradeep_raj_004:kongu2004@cluster0.hpn3ilb.mongodb.net/";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

const Userdetails = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    announcement: String,
    Date: { type: Date, default: Date }, // Add the "registrationDate" field with the current date as the default value
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", Userdetails);

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, announcement,Date } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "User Exists" });
    }
    await User.create({
      firstName,
      lastName,
      email,
      announcement,
      Date,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ status: "error", error: "User Not Found" });
  }

  console.log("Login Successful");
  res.json({ status: "ok", message: "Login Successful" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        if (data) {
          res.json({ status: "ok", data: data });
        } else {
          res.json({ status: "error", data: "User not found" });
        }
      })
      .catch((error) => {
        res.json({ status: "error", data: error });
      });
  } catch (error) {
    res.json({ status: "error", data: error });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

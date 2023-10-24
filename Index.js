const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");



const JWT_SECRET = "sdfghjkl;kjhgfdghjkljhgfhjkljhgfh9876546789876578()././.";

const mongoUrl = "mongodb+srv://praneshkangeyanse21it:sepk2003@cluster0.uyh6rjw.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true

})
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => console.log(e));

require("./user");

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
    const { fname, lname, email, pass } = req.body;
    const encryptedPassword = await bcrypt.hash(pass, 10);

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ error: "User Exists" });
        }
        await User.create({
            fname,
            lname, email,
            pass: encryptedPassword,
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
        return res.json({ status: "error", error: "User Not Found" }); // Send an error status
    }
    if (await bcrypt.compare(pass, user.pass)) {
        const token = jwt.sign({}, JWT_SECRET);

        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ status: "error", error: "Server Error" }); // Send an error status
        }
    }
    res.json({ status: "error", error: "Invalid Password" });
});


app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const useremail = user.email;
      User.findOne({ email: useremail })
        .then((data) => {
          if (data) {
            res.json({ status: "ok", data: data }); // Send the user data as JSON
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
    console.log("server started");
});
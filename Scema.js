const mongoose = require("mongoose");

const Userdetails = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    announcement: String, // Add the "Announcement" field
    Date: { type: Date, default: Date}, // Add the "registrationDate" field with the current date as the default value
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", Userdetails);

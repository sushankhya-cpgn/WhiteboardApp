const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email address"],
    unique: true,
    validate: {
      validator: function EmailValidator() {
        return this.email.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      },
    },
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: function validator() {
      return this.password === this.confirmPassword;
    },
  },
});

UserSchema.pre("save", async function (req, res, next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
});

const userModel = mongoose.model("UserSchema", UserSchema);

module.exports = userModel;

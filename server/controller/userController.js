const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const get_token = (id) => {
  const token = jwt.sign(id, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
  return token;
};

exports.getUserByToken = async function getUserByToken(req, res) {
  try {
    const authtoken = req.cookies.token;
    console.log("above request cookie");
    console.log(authtoken);
    const decoded = jwt.verify(authtoken, process.env.TOKEN_SECRET);

    console.log("dedoced", decoded);
    const { name, email } = await User.findById(decoded.id);
    res.status(200).json({ status: "success", data: { name, email } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: "No Such User Exists" });
  }
};

exports.protect = async function protect(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ status: "fail", message: "Invalid or expired token" });
  }
};

exports.login = async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);

    if (!email || !password) {
      throw new Error("Enter Email and Password");
    } else {
      if (user) {
        console.log("User exists");

        if (await bcrypt.compare(password, user.password)) {
          const id = user._id.toString();
          const token = get_token({ id });
          console.log("token sent in response", token);
          res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true if you are using HTTPS
            sameSite: "None", // This is important for cross-origin requests
          });

          res.status(200).json({
            status: "success",
            message: "Email and password match",
            data: {
              name: user.name,
              email: user.email,
            },
          });
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("No user registered with this email");
      }
    }
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

exports.register = async function register(req, res) {
  try {
    const query = User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    const user = await query;

    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

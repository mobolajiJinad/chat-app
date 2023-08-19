const User = require("../model/User");

const loginController = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    req.flash("error", "User does not exists");
    return res.redirect("/auth/login");
  }

  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    req.flash("error", "Invalid password");
    return res.redirect("/auth/login");
  }

  const token = user.generateJWT();
  req.session.token = token;
  res.redirect("/chat");
};

const signupController = async (req, res) => {
  const { username, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("/auth/signup");
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    req.flash("error", "Username already exists");
    return res.redirect("/auth/login");
  }

  const usernameRegex = /^[a-zA-Z0-9\- ]{5,12}$/;
  if (username.length < 5 || username.length >= 12) {
    req.flash("error", "Username should be between 5 to 12 characters");
    return res.redirect("/auth/signup");
  }

  if (!usernameRegex.test(username)) {
    req.flash(
      "error",
      "Invalid username. Only hyphens are allowed as special characters."
    );
    return res.redirect("/auth/signup");
  }

  const passwordRegex = /^(?=.*\d)(?=.*[!@_#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/;
  if (password.length < 7) {
    req.flash("Password's too short");
    return res.redirect("/auth/signup");
  }

  if (!passwordRegex.test(password)) {
    req.flash(
      "error",
      "Password must contain at least one special character and one number."
    );
    return res.redirect("/auth/signup");
  }

  const user = new User({ username, password });
  const token = user.generateJWT();
  await user.save();

  req.session.token = token;
  res.redirect("/chat");
};

module.exports = {
  loginController,
  signupController,
};

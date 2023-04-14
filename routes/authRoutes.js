const express = require("express");

const {
  loginController,
  signupController,
} = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/login")
  .get((req, res) => {
    res.render("login", {
      title: "Login page",
      msg: { error: req.flash("error"), success: req.flash("success") },
    });
  })
  .post(loginController);

router
  .route("/signup")
  .get((req, res) => {
    res.render("signup", {
      title: "Sign up page",
      msg: { error: req.flash("error"), success: req.flash("success") },
    });
  })
  .post(signupController);

module.exports = router;

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    req.flash("error", "You're not logged in");
    return res.redirect("/auth/login");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userID: payload.userID };
    next();
  } catch (err) {
    req.flash("error", "Something went wrong. Please try again later");
    return res.redirect("/auth/login");
  }
};

const guestMiddleware = (req, res, next) => {
  const token = req.session.token;

  if (token) {
    return res.redirect("/chat");
  }

  next();
};

module.exports = { authMiddleware, guestMiddleware };

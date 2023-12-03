const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  let token;

  if (bearerToken && bearerToken.startsWith("Bearer ")) {
    token = bearerToken.split(" ")[1];
  } else {
    return res.status(401).json({ error: "Invalid bearer token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userID: payload.userID };
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = authMiddleware;

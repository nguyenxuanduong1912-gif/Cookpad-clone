const jwt = require("jsonwebtoken");
module.exports.authMidleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SUPERSECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" });
    }
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

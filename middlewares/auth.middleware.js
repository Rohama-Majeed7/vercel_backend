import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(token, "helloworld");

    req.user = decoded;
    req.token = token;
    req.userID = decoded._id;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

import jwt from "jsonwebtoken";
export const authMiddleware = async(req,res,next) =>{
    const token = req.header("Authorization");
    // console.log(token);
    if (!token) {
        // If you attempt to use an expired token, you'll receive a "401 Unauthorized HTTP" response.
        return res
          .status(401)
          .json({ message: "Unauthorized HTTP, Token not provided" });
      }
      const jwtToken = token.replace("Bearer","").trim();
      try {
        const isVerified = jwt.verify(jwtToken, "helloworld");
        // console.log(isVerified);
        const userData = isVerified
            req.user = userData
            req.token = jwtToken
            req.userID = userData._id;
            next()
      } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: `Unauthorized Invalid token.` });
    }
}
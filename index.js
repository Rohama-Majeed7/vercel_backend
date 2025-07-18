import express from "express";
import UserRouter from "./routes/user.route.js";
import cors from "cors";
import mongoose from "mongoose";
// import path from "path";
import dotenv from "dotenv";

dotenv.config(); // in case you move URI to .env later

const app = express();
// const _dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://vercel-frontend-k6z3.vercel.app", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.get("/", (req, res) => {
  res.send("Backend is running");
});
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ✅ CORRECT MongoDB connection block
(async () => {
  try {
    const uri =process.env.MONGODB_URI
    // ryLNH8FVCpbsaZeG
    await mongoose.connect(uri);

    console.log("✅ Database connected");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
  }
})();

// Routes
app.use("/user", UserRouter);

// Serve frontend
// app.use(express.static(path.join(_dirname, "/Frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
// });
const PORT = process.env.PORT || 3000
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

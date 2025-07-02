import express from "express"
import { signUp ,login,profile, createPost,updatePost,editPost, deletePost,likePost} from "../controllers/user.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/signup",signUp)
router.post("/login",login)
router.get("/profile",authMiddleware,profile)
router.post("/post",authMiddleware,createPost)
router.get("/edit/:id",updatePost)
router.put("/update/:id",editPost)
router.delete("/delete/:id",deletePost)
router.get("/like/:id",authMiddleware,likePost)



export default router
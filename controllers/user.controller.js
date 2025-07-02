import User from "../models/user.model.js";
import Post from "../models/post.model.js";
// for signUp
export const signUp = async (req, res) => {
  try {
    const { fullName , email , password } = req.body;
    let userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const userCreated = await User.create({
      fullName,
      email,
      password,
    });
    if (userCreated) {
      return res.json({
        msg: "sign up successfully",
        token: await userCreated.generateToken(),
        userId: userCreated._id.toString(),
      });
    }
  } catch (error) {
    console.log("error:", error.message);
  }
};
// for login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    const isMatch = await userExist.isPasswordValid(password);
    if (isMatch) {
      return res.json({
        msg: "login successfully",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("error:", error.message);
    res.json({ status: 500, message: "internal server error" });
  }}
// for Profile
const profile = async (req, res) => {
  try {
   const userData = await User.findOne({ email:req.user.email}).select("-password").populate("posts");    
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(` error from user route ${error}`);
  }
};

const updatePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id })
  // console.log(post);

  res.json({ post });
};
const createPost = async (req, res) => {
  const {content,image} = req.body
  console.log("reqbody",req.body);
  
  const user = await User.findOne({ email:req.user.email})   

  const post = await Post.create({
    user: user._id,
    content:content,
    image:image
  });
  user.posts.push(post._id);
  await user.save();
  res.json({msg:"Post Created Successfully" });
};
// edit post
const editPost = async (req, res) => {
  const id = req.params.id
   await Post.findOneAndUpdate(
    { _id: id },
    { content: req.body.content }
  )
  res.json({msg:"Post Updated Successfully"})
};
const deletePost = async (req,res) =>{
 const id = req.params.id
  await Post.deleteOne({_id:id});
 res.json({message:"Post Deleted Successfully"})
}
const likePost = async (req,res) =>{
  const post = await Post.findById(req.params.id);
  if (post) {
    if (post.likes.indexOf(req.user.userId) === -1) {
      post.likes.push(req.user.userId)
    } else {
      post.likes.splice(post.likes.indexOf(req.user.userId),1);
    }

    await post.save();
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
 }
export { login, profile, createPost, updatePost ,editPost,deletePost,likePost}

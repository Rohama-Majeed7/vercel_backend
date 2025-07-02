import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(this.password, salt);
      this.password = hash_password;
    } catch (error) {
      next(error);
    }
  });
  // json web token
  userSchema.methods.generateToken = async function () {
    const token =await jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        posts:this.posts
      },
      "helloworld",
      {
        expiresIn: "30d",
      }
    );
    // console.log(token);
    return token;
  };
  userSchema.methods.isPasswordValid= async function (pass){
  try {
    return bcrypt.compare(pass,this.password);
  } catch (error) {
    console.log("error:",error);
  }
  
  }

const User = mongoose.model("user",userSchema)

export default User
import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
//define schema properties
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, " name field cannot be empty"],
  },
  email: {
    type: String,
    required: [true, " email field cannot be empty "],
    unique: [true, "this email has been used , please try different one "],
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  role: {
    default: "user",
    type: String,
    enum: ["user", "admin"],
  },
});
// hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//compare password

userSchema.methods.ComparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};

export const userModel = mongoose.model("User", userSchema);

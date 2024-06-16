import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],

    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Your phoneNumber  is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  role: {
    type: String,
    required: [true, "Your role is required"],
    enum: ["employer", "recruiter"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;

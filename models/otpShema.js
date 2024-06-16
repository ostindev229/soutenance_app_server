import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
  phoneNumber: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Le code expire après 5 minutes (300 secondes)
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;

import OTP from "../../models/otpShema.js";
import sendVerificationSMS from "../../util/sendVerificationCode.js";

const OTP_VALIDITY_DURATION = 5 * 60 * 1000;

const resendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const existingOTP = await OTP.findOne({ phoneNumber });
    if (existingOTP) {
      const now = new Date();
      const otpCreationTime = new Date(existingOTP.createdAt);
      const timeDifference = now - otpCreationTime;

      if (timeDifference < OTP_VALIDITY_DURATION) {
        return res
          .status(400)
          .json({ message: " The first OTP is also still valid" });
      }
    }

    // Générer un nouveau code OTP
    const newOTPCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Mettre à jour le code OTP dans la base de données
    const otpEntry = await OTP.findOneAndUpdate(
      { phoneNumber },
      { code: newOTPCode, createdAt: new Date() },
      { new: true, upsert: true }
    );

    if (!otpEntry) {
      return res.status(400).json({ message: "Failed to create OTP entry" });
    }

    // Envoyer le nouveau code OTP
    await sendVerificationSMS(phoneNumber, newOTPCode);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default resendOTP;

import User from "../../models/userModel.js";
import OTP from "../../models/otpShema.js";

const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    // Vérifiez si un code OTP existe dans la base de données pour le numéro de téléphone donné
    const existingOTP = await OTP.findOne({ phoneNumber });
    if (!existingOTP) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Vérifiez si le code OTP envoyé correspond au code stocké dans la base de données
    if (existingOTP.code !== code) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Mettez à jour l'utilisateur correspondant pour définir isVerified sur true
    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Supprimez le code OTP de la base de données une fois qu'il a été vérifié
    await OTP.deleteOne({ phoneNumber });

    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyOTP;

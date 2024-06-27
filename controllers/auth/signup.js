import User from "../../models/userModel.js";
import OTP from "../../models/otpShema.js";
import bcrypt from "bcryptjs";
import sendVerificationSMS from "../../util/sendVerificationCode.js";
import dotenv from "dotenv";

dotenv.config(); //
const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);

  return code.toString();
};

const signup = async (req, res) => {
  try {
    const { username, email, phoneNumber, role, password } = req.body;
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.create({
      username,
      email,
      phoneNumber,
      role,
      password: hashedPassword,
    });

    const verificationCode = generateVerificationCode();
    console.log(verificationCode);

    await sendVerificationSMS(phoneNumber, verificationCode); // Envoie du SMS de vérification
    console.log("Successfully");
    // Enregistrement du code OTP dans la collection OTP
    await OTP.create({
      phoneNumber,
      code: verificationCode,
    });

    // Création de l'utilisateur

    return res
      .status(201)
      .json({ message: "User signup successfully", success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
};

// Fonction pour vérifier le code OTP lors du processus de connexion

export default signup;

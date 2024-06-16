import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../../util/secretToken.js";

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({
        message: "Le numéro de téléphone n'est pas associé à un compte",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Le mot de passe est incorrect" });
    }
    const token = createSecretToken(user._id);
    console.log(token);

    res
      .status(200)
      .json({ message: "Connexion réussie", success: true, user, token });
  } catch (error) {
    return res.status(500).json({
      error_message: error,
    });
  }
};

export default login;

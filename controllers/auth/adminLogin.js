import Admin from "../../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.TOKEN_KEY;

export const adminLoginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Comparez le mot de passe
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Créez un token JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      SECRET_KEY,
      { expiresIn: 3 * 24 * 60 * 60 }
    );

    res.status(200).json({ message: "Authentification réussie.", token });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de l'authentification.",
      error: error.message,
    });
  }
};

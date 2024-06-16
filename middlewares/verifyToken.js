import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const decodeToken = async (token) => {
  const decodedData = jwt.verify(token, process.env.TOKEN_KEY);

  // Extraire l'ID de l'utilisateur du token décodé
  const userId = decodedData.id;

  // Récupérer les informations de l'utilisateur à partir de l'ID
  const user = await User.findById(userId);

  return user;
};

export const verifyToken = async (req, res, next) => {
  try {
    // Extraire le token de l'en-tête Authorization
    const token = req.headers.authorization.split(" ")[1];
    // Récupérer les informations de l'utilisateur à partir de l'ID
    const user = await decodeToken(token);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    req.user = user;

    // Renvoyer les informations de l'utilisateur
    next();
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération des informations de l'utilisateur.",
    });
  }
};

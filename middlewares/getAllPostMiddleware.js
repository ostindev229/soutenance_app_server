import { decodeToken } from "./verifyToken.js";

export const getAllPostMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      next();
    } else {
      token = token.split(" ")[1];
      console.log("TOKEN", typeof token);
      if (token === "null") {
        next();
        return;
      } else {
        // Récupérer les informations de l'utilisateur à partir de l'ID
        const user = await decodeToken(token);
        req.user = user;
      }

      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Erreur lors de la récupération des informations de l'utilisateur.",
    });
  }
};

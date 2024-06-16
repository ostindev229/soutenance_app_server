import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";

async function isAdmin(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: 401,
        error: "Unauthorized access",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: 401,
        error: "Unauthorized access",
      });
    }
    const decodedData = jwt.verify(token, process.env.TOKEN_KEY);
    const adminId = decodedData.id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({
        status: 401,
        error: "Unauthorized access",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
}

export default isAdmin;

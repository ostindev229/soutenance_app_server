import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/adminModel.js";
import dotenv from "dotenv";
dotenv.config();

// Connectez-vous à votre base de données MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initializeAdmin = async () => {
  const adminUsername = "admin";
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Créer un nouvel administrateur
  const newAdmin = new Admin({
    username: adminUsername,
    password: hashedPassword,
  });

  try {
    await newAdmin.save();
    console.log("Admin initialized successfully.");
  } catch (error) {
    console.error("Error initializing admin:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

initializeAdmin();

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.router.js";
import jobRoutes from "./routes/jobPosts.router.js";
import postulateRoutes from "./routes/candidatApply.router.js";
import adminRoutes from "./routes/admin.router.js";
import userRouter from "./routes/user.router.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import transporter from "./controllers/mailer.js";

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));

const corsOption = {
  origin: "*",
};

app.use(cors(corsOption));
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Find a job server api");
});

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/candidate", verifyToken, postulateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", verifyToken, userRouter);

const MONGO_URL = process.env.MONGO_URL;

const PORT = process.env.PORT || 5000;

console.log(MONGO_URL);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

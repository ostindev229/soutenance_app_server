import express from "express";
import { adminLoginController } from "../controllers/auth/adminLogin.js";
import getAllJobsController from "../controllers/admin/getAllJobs.js";
import isAdmin from "../middlewares/isAdmin.js";
import updateJobStatusController from "../controllers/admin/updateJobStatus.js";
const router = express.Router();

// Route pour l'authentification de l'administrateur
router.post("/login", adminLoginController);
router.get("/get-all-jobs", isAdmin, getAllJobsController);
router.post("/update-job-status", isAdmin, updateJobStatusController);

export default router;

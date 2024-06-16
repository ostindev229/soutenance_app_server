import express from "express";
import update from "../controllers/user/update.js";
import {
  getJobsInfoByCandidateId,
  deleteJob,
} from "../controllers/user/employee/jobs.js";
import reject from "../controllers/user/recruiter/application/reject.js";
const userRouter = express.Router();

userRouter.put("/update", update);
userRouter.get("/employee/jobs", getJobsInfoByCandidateId);
userRouter.delete("/employee/jobs/:id", deleteJob);

/// Recruiters
userRouter.post("/recruiter/application/reject/:id", reject);

export default userRouter;

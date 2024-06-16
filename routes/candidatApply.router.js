import express from "express";

import { postulateJobController } from "../controllers/candidateApply/applyPost.js";
import { getPostulatesByJobOfferId } from "../controllers/candidateApply/applyPost.js";

const router = express.Router();

router.post("/postulate", postulateJobController);
router.get("/postulates/:jobOfferId", getPostulatesByJobOfferId);

export default router;

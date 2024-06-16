import express from "express";
import { getAllPostMiddleware } from "../middlewares/getAllPostMiddleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import getStats from "../controllers/stats/getStats.js";

import {
  getPosts,
  getAllPosts,
  createPost,
  deletePostById,
  updatePostById,
  validateJobApplication,
  searchPostByValue,
} from "../controllers/jobPost/jobPost.js";

const router = express.Router();

router.get("/", verifyToken, getPosts);
router.get("/all-jobs", getAllPostMiddleware, getAllPosts);
router.post("/create", verifyToken, createPost);
router.get("/search", verifyToken, searchPostByValue);

router.get("/stats", verifyToken, getStats);

router.post(
  "/validate-job-application/:jobOfferId",
  verifyToken,
  validateJobApplication
);
router.delete("/delete/:id", verifyToken, deletePostById);
router.patch("/update/:id", updatePostById);

export default router;

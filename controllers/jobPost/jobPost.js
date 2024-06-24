import express from "express";

import JobMessage from "../../models/jobShema.js";
import PostulateJob from "../../models/postulateShema.js";
import User from "../../models/userModel.js";
import { sendMail } from "../mailer.js";

const router = express.Router();
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  try {
    const jobMessages = await JobMessage.find({ recruiter: req.user._id });

    res.status(200).json(jobMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const user = req.user;
    const jobMessages = await JobMessage.find({ status: { $eq: "ACCEPT" } });
    console.log(jobMessages.length);
    console.log(jobMessages[0]);
    if (user) {
      const jobMessageWithIsAppliedState = jobMessages.map((job) => {
        const isApplied = job.participants.includes(user._id);
        return { ...job._doc, isApplied };
      });

      return res.status(200).json(jobMessageWithIsAppliedState);
    }

    res.status(200).json(jobMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const job = req.body;
  const location = req.body.location;
  console.log(location);
  const locationList = location.split(",");

  console.log("User", req.user);

  const newJobMessage = new JobMessage({
    ...job,
    location: locationList,
    recruiter: req.user._id,
    createdAt: new Date().toISOString(),
  });

  try {
    await newJobMessage.save();

    res.status(201).json(newJobMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deletePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await JobMessage.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

export const updatePostById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  console.log(updatedData);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No post with id: ${id}`);
  }

  try {
    const updatedPost = await JobMessage.findByIdAndUpdate(
      id,
      { ...updatedData, _id: id },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send(`No post with id: ${id}`);
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateJobApplication = async (req, res) => {
  const jobOfferId = req.params["jobOfferId"];
  const candidateId = req.body["candidateId"];

  console.log("Job offer id", jobOfferId);
  try {
    if (!jobOfferId || !candidateId) {
      return res
        .status(401)
        .json({ message: "Job offer id or  candidate id is required" });
    }
    const job = await JobMessage.findById(jobOfferId);
    const candidate = await PostulateJob.findById(candidateId);
    if (!job) {
      return res.status(404).json({ message: "Job offer not found" });
    }
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    await JobMessage.findByIdAndUpdate(jobOfferId, {
      $push: { acceptedCandidateId: candidateId },
    });
    await PostulateJob.findByIdAndUpdate(candidateId, {
      $set: { status: "ACCEPT" },
    });
    const employee = await User.findById(candidate.candidateId);

    const data = {
      jobName: job.category,
      status: "acceptée",
      url: `${process.env.FRONT_END_URL}/employee-dashboard`,
      detail: "Vous serez contacté par whats'app pour la suite.",
    };

    sendMail(
      "candidatureStatusEmailTemplate.html",
      data,
      employee.email,
      "JobBenin"
    );
    return res.status(200).json({ message: "Candidate accepted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchPostByValue = async (req, res) => {
  const { category, typeTemps, location } = req.query;

  console.log("Category", category);
  console.log("typeTemps", typeTemps);
  console.log("Location", location);
  const locationLower = location.split(",").map((loc) => loc.toLowerCase());

  console.log("Location splitted", locationLower);
  const posts = await JobMessage.find({
    category: { $eq: category.toLowerCase() },
    typeTemps: { $eq: typeTemps.toLowerCase() },
    location: { $in: locationLower },
  });

  return res.status(200).json(posts);
};

export default router;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postulateJobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  applyDate: {
    type: Date,
    required: true,
  },
  selectedCvFile: {
    type: String,
    required: true,
  },
  jobOfferId: {
    type: Schema.Types.ObjectId,
    ref: "JobMessage",
  },
  status: {
    type: String,
    default: "IN_PROGRESS",
    enum: ["IN_PROGRESS", "ACCEPT", "REJECT"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const PostulateJob = mongoose.model("PostulateJob", postulateJobSchema);

export default PostulateJob;

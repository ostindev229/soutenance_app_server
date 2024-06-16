import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jobMessageSchema = mongoose.Schema({
  creator: String,
  category: String,
  description: String,
  location: [String],
  selectedFile: String,
  finalDate: Date,
  totalParticipate: Number,
  typeTemps: String,
  competenceSearch: String,
  acceptedCandidateId: {
    type: [Schema.Types.ObjectId],
    ref: "PostulateJob",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    default: "IN_PROGRESS",
    enum: ["IN_PROGRESS", "ACCEPT", "REJECT"],
  },
});

const JobMessage = mongoose.model("JobMessage", jobMessageSchema);

export default JobMessage;

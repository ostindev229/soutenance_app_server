import JobMessage from "../../models/jobShema.js";
import User from "../../models/userModel.js";
import { sendMail } from "../mailer.js";

async function updateJobStatusController(req, res) {
  const { jobId, status } = req.body;

  try {
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }
    if (!["ACCEPT", "REJECT"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await JobMessage.findByIdAndUpdate(
      jobId,
      { status: status },
      { new: true }
    );
    console.log(job);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const recruiter = await User.findById(job.recruiter);
    console.log(recruiter);

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const data = {
      jobName: job.category,
      status: status === "ACCEPT" ? "acceptée" : "rejetée",
      url: `${process.env.FRONT_END_URL}/recruiter-dashboard`,
    };

    console.log("Processing email");
    console.log(recruiter.email);

    sendMail(
      "jobPostStatusEmailTemplate.html",
      data,
      recruiter.email,
      "JobBenin"
    );

    return res.json({
      message: "Job status updated successfully",
      updatedPost: job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default updateJobStatusController;

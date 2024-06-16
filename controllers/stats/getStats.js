import JobMessage from "../../models/jobShema.js";

const getStats = async (req, res) => {
  try {
    const pendingJobs = await JobMessage.find({
      status: "IN_PROGRESS",
      recruiter: req.user._id,
    }).count();
    const acceptedJobs = await JobMessage.find({
      status: "ACCEPT",
      recruiter: req.user._id,
    }).count();
    const rejectedJobs = await JobMessage.find({
      status: "REJECT",
      recruiter: req.user._id,
    }).count();

    return res
      .status(200)
      .json({
        pending: pendingJobs,
        accepted: acceptedJobs,
        rejected: rejectedJobs,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default getStats;

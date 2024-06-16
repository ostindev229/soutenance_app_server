import JobMessage from "../../../models/jobShema.js";
import PostulateJob from "../../../models/postulateShema.js";

// All the jobs that a user has applied to

const getJobsInfoByCandidateId = async (req, res) => {
  try {
    const id = req.user._id;

    const jobs = await JobMessage.find({
      participants: { $in: [id] },
    });
    const postulateAsync = jobs.map(async (job) => {
      const postulate = await PostulateJob.findOne({
        jobOfferId: job._id,
        candidateId: id,
      });

      return {
        category: job.category,
        creator: job.creator,
        location: job.location,
        selectedFile: job.selectedFile,
        typeTemps: job.typeTemps,
        status: postulate.status,
        createdAt: postulate.createdAt,
      };
    });

    const postulates = await Promise.all(postulateAsync);

    return res.status(200).json(postulates);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await PostulateJob.findOne({ _id: id });
    console.log(job);
    await PostulateJob.deleteOne({ _id: id });
    await JobMessage.updateOne(
      { _id: job.jobOfferId },
      { $pull: { participants: req.user._id } }
    );
    return res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export { getJobsInfoByCandidateId, deleteJob };

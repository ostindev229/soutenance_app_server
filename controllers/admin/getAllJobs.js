import JobMessage from "../../models/jobShema.js";

async function getAllJobsController(req, res) {
  try {
    const jobs = await JobMessage.find();
    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

export default getAllJobsController;

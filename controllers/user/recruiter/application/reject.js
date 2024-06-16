import JobMessage from "../../../../models/jobShema.js";
import PostulateJob from "../../../../models/postulateShema.js";

async function reject(req, res) {
  //   const userId = req.user._id;
  //   const jobId = req.body.jobId;
  const postulateId = req.params.id;

  try {
    console.log(postulateId);
    await PostulateJob.findOneAndUpdate(
      { _id: postulateId },
      { status: "REJECT" }
    );

    return res.status(200).json({ messge: "Application rejected" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default reject;

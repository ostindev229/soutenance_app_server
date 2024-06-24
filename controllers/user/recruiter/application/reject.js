import PostulateJob from "../../../../models/postulateShema.js";
import User from "../../../../models/userModel.js";
import { sendMail } from "../../../mailer.js";
import JobMessage from "../../../../models/jobShema.js";

async function reject(req, res) {
  const postulateId = req.params.id;

  try {
    const application = await PostulateJob.findOneAndUpdate(
      { _id: postulateId },
      { status: "REJECT" }
    );
    const employee = await User.findOne({ _id: application.candidateId });
    const job = await JobMessage.findOne({ _id: application.jobOfferId });
    const employeeEmail = employee.email;
    console.log("Employee email", employeeEmail);
    //send email to the employee
    const data = {
      jobName: job.category,
      status: "rejetée",
      url: `${process.env.FRONT_END_URL}/employee-dashboard`,
    };

    sendMail(
      "candidatureStatusEmailTemplate.html",
      data,
      employeeEmail,
      "JobBenin"
    );
    return res.status(200).json({ messge: "Application rejected" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default reject;

import JobMessage from "../../models/jobShema.js";
import User from "../../models/userModel.js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import hdls from "handlebars";
import { fileURLToPath } from "url";

async function updateJobStatusController(req, res) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "jsognon8@gmail.com",
      pass: "dfekruakjmsirtts",
    },
  });
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(
    __dirname,
    "templates/jobPostStatusEmailTemplate.html"
  );
  console.log(templatePath);
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = hdls.compile(templateSource);

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
    };
    const jobPostStatusEmailHtml = template(data);
    const mailOptions = {
      from: process.env.EXPEDITEUR_MAIL, // adresse de l'expéditeur
      to: recruiter.email, // adresse du destinataire
      subject: "JobBenin",
      text: "Contenu du mail en texte brut",
      html: jobPostStatusEmailHtml, // optionnel
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email envoyé: " + info.response);
    });

    return res.json({
      message: "Job status updated successfully",
      updatedPost: job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default updateJobStatusController;

import nodemailer from "nodemailer";
import hdls from "handlebars";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "jsognon8@gmail.com",
    pass: "dfekruakjmsirtts",
  },
});

function sendMail(templateName, data, destination, subject) {
  const templatePath = path.join(__dirname, `templates/${templateName}`);

  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = hdls.compile(templateSource);
  const htmlToSend = template(data);

  const mailOptions = {
    from: process.env.EXPEDITEUR_MAIL, // adresse de l'expéditeur
    to: destination,
    subject: subject,
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email envoyé: " + info.response);
  });
}

export default transporter;
export { sendMail };

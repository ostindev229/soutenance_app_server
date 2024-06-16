import { Vonage } from "@vonage/server-sdk";
const sendVerificationSMS = async (phoneNumber, verificationCode) => {
  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
  });

  const from = process.env.VONAGE_FROM_NUMBER;
  console.log(from);
  const to = phoneNumber;
  const text = `Votre code de vérification est : ${verificationCode}`;
  console.log(to);

  vonage.sms.send({ from, to, text }).then((response) => {
    console.log(response);
  });
};
export default sendVerificationSMS;

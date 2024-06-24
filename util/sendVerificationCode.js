import axios from "axios";

// URL de l'API Ourvoice pour envoyer des messages
const apiUrl = "https://api.getourvoice.com/v1/messages";

// Clé d'API
const apiKey = process.env.OURVOICE_API_KEY;

// Fonction pour vérifier et formater le numéro de téléphone
const formatPhoneNumber = (phoneNumber) => {
  // Retirer les espaces, tirets et autres caractères non numériques
  const formattedNumber = phoneNumber.replace(/\D/g, "");

  // Ajouter le code du pays si nécessaire
  if (formattedNumber.length === 10) {
    return `1${formattedNumber}`; // Supposons que le code du pays est 1
  }

  return formattedNumber;
};

// Fonction asynchrone pour envoyer un SMS
const sendVerificationSMS = async (phoneNumber, verificationCode) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    if (formattedNumber.length !== 11) {
      throw new Error(
        "Le numéro de téléphone doit contenir 11 chiffres après formatage."
      );
    }

    const response = await axios.post(
      apiUrl,
      {
        from: "JobBenin",
        to: [formattedNumber], // Utiliser le numéro formaté
        body: `Votre code de vérification est : ${verificationCode}`,
        sender_name: "JobBenin", // Ajouter le sender_name
      },

      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(`Message envoyé à: ${phoneNumber}`);
    console.log("Envoie réussi");
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement du message:",
      error.response ? error.response.data : error.message
    );
  }
};

export default sendVerificationSMS;

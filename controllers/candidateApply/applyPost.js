import PostulateJob from "../../models/postulateShema.js";
import mongoose from "mongoose";
import JobMessage from "../../models/jobShema.js";

export const postulateJobController = async (req, res) => {
  const { jobOfferId, ...applyJob } = req.body;

  try {
    const jobOfferObjectId = mongoose.Types.ObjectId.isValid(jobOfferId)
      ? new mongoose.Types.ObjectId(jobOfferId)
      : null;

    if (!jobOfferObjectId) {
      return res
        .status(400)
        .json({ message: "ID de l'offre d'emploi invalide." });
    }

    const user = req.user;
    console.log(user);

    const newPostulateJob = new PostulateJob({
      ...applyJob,
      jobOfferId: jobOfferObjectId,
      candidateId: user._id,
    });
    const userId = req.user._id;
    console.log("userId", userId);

    await newPostulateJob.save();
    await JobMessage.findOneAndUpdate(
      { _id: jobOfferObjectId },
      { $push: { participants: userId } }
    );
    await res
      .status(201)
      .json({ message: "Candidature enregistrée avec succès." });
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la soumission de la candidature.",
      error: error.message,
    });
  }
};

export const getPostulatesByJobOfferId = async (req, res) => {
  const { jobOfferId } = req.params;

  try {
    const jobOfferObjectId = mongoose.Types.ObjectId.isValid(jobOfferId)
      ? new mongoose.Types.ObjectId(jobOfferId)
      : null;

    if (!jobOfferObjectId) {
      return res
        .status(400)
        .json({ message: "ID de l'offre d'emploi invalide." });
    }

    const postulates = await PostulateJob.find({
      jobOfferId: jobOfferObjectId,
    });

    res.status(200).json(postulates);
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des candidatures.",
      error: error.message,
    });
  }
};

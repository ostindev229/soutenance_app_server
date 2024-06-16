import User from "../../models/userModel.js";

const update = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    return res.status(200).json({ message: "User update", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export default update;

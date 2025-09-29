import User from "../models/users.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, skills, description } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, phone, skills, description });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

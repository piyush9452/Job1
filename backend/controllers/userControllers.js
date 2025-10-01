import User from "../models/users.js";
import jwt from "jsonwebtoken";
// import errorHandler from "../middleware/errorhandler.js";
import bcrypt from "bcrypt";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password:hashedPassword, phone});
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // store secret in .env
      { expiresIn: "240h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // get user id from URL
    const updates = req.body;     // only the fields provided

    const notAllowed = ["email", "password", "phone"]; 
    notAllowed.forEach(field => delete updates[field]);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },   // update only provided fields
      { new: true, runValidators: true } // return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const userDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
import express from "express";
import { createUser,loginUser,updateUser,userDetails } from "../controllers/userControllers.js";

const router = express.Router();

// Create a new user
router.post("/register", createUser);

router.post("/login", loginUser);

router.patch("/:id", updateUser);

router.get("/:id", userDetails);


// Get all users
// router.get("/", getUsers);

// // Get a single user by ID
// router.get("/:id", getUserById);

// // Update a user
// router.put("/:id", updateUser);

// // Delete a user
// router.delete("/:id", deleteUser);

export default router;
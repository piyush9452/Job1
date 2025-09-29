import express from "express";
import { createUser } from "../controllers/userControllers.js";

const router = express.Router();

// Create a new user
router.post("/", createUser);

// Get all users
// router.get("/", getUsers);

// // Get a single user by ID
// router.get("/:id", getUserById);

// // Update a user
// router.put("/:id", updateUser);

// // Delete a user
// router.delete("/:id", deleteUser);

export default router;
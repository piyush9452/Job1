import express from "express";
import { createUser,loginUser,updateUser,userDetails,G_Auth } from "../controllers/userControllers.js";

const router = express.Router();

// Create a new user
router.post("/register", createUser);

router.post("/login", loginUser);

router.patch("/:id", updateUser);

router.get("/:id", userDetails);

router.post('/api/auth/google-signin',G_Auth);

export default router;
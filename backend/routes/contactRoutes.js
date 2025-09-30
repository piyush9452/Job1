import express from "express";
import { createUser,loginUser } from "../controllers/userControllers.js";

const router = express.Router();


router.post("/contact", loginUser);

export default router;
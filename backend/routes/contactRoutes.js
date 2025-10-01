import express from "express";
import { contactUs,getContactmessage } from "../controllers/contactControllers.js";

const router = express.Router();


router.post("/", contactUs);

router.get("/:id", getContactmessage);



export default router;
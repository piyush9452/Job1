import express from "express";
import protect from "../middleware/authorization.js";
import { allApplicationFromUser, createApplication} from "../controllers/applicationControllers.js";

const router = express.Router();


router.post("/", protect, createApplication);

router.get("/:id",protect,  allApplicationFromUser);


export default router;
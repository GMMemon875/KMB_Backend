import express from "express";
import {
  deleteMessage,
  getAllMessages,
  Sendmassage,
} from "../Controllar/MassageControllar.js";

import { isAdminAthantication } from "../middlewere/Auth.js";

const router = express.Router();

router.post("/send", Sendmassage);
router.get("/getall", isAdminAthantication, getAllMessages);
router.delete("/delete/:id", deleteMessage);

export default router;

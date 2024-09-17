import express from "express";
import {
  deleteById,
  deleteUser,
  getAllUsers,
  getAttendance,
  login,
  registerUser,
  requestLeave,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { markAttendance } from "../controllers/authController.js";
import { leaveReqModel } from "../models/leaveReq.model.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/getUsers", getAllUsers);
router.delete("/deleteUser", deleteUser);
router.delete("/deletId/:id", deleteById);
router.post("/mark", protect, markAttendance);
router.get("/history", protect, getAttendance);
router.post("/attendance/leave", protect, requestLeave);

export default router;

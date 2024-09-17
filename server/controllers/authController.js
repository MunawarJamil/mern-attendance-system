import { ErrorResponse } from "../middlewares/errorHandler.js";
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import attendanceModel from "../models/attendance.model.js";
import { leaveReqModel } from "../models/leaveReq.model.js";

// User Registration
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const checkExistingUser = await userModel.findOne({ email });
  if (checkExistingUser) {
    return res.status(400).json({ msg: "user already exist" });
  }

  try {
    const newUser = new userModel({ name, email, password });
    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        id: newUser._id,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("error while registering the user");
    next(error);
  }
};

//get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "cannot fetch user data",
      error: error.message,
    });
  }
};

//login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    const isPasswordMatch = await user.ComparePassword(password);
    if (!isPasswordMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error during login", error);

    next(error);
  }
};

//delete all user

export const deleteUser = async (req, res) => {
  try {
    const deleteUser = await userModel.deleteMany();
    if (deleteUser.deletedCount == 0) {
      return res.status(404).json({ msg: "no user found to delete" });
    }
    res.status(200).json({
      msg: "user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error occured while deleting the user",
      error: error.message,
    });
  }
};

//delete single user

export const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteone = await userModel.findByIdAndDelete(id);
    if (!deleteone) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "User has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error occurred while deleting user",
      error: error.message,
    });
  }
};

// Mark Attendance
export const markAttendance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get today's date (without the time part)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance is already marked for today
    const alreadyMarked = await attendanceModel.findOne({
      user: userId,
      date: today,
    });

    if (alreadyMarked) {
      return next(
        new ErrorResponse("Attendance already marked for today", 400)
      );
    }

    // Mark attendance as present
    const attendance = new attendanceModel({
      user: userId,
      date: today,
      status: "Present",
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

//view attendance history
export const getAttendance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const attendanceRecords = await attendanceModel.find({ user: userId });

    res.status(200).json({
      success: true,
      data: attendanceRecords,
    });
  } catch (error) {
    next(error);
  }
};

//send leave request
export const requestLeave = async (req, res, next) => {
  try {
    const { reason, startDate, endDate } = req.body;
    const userId = req.user.id;

    // Check if all fields are provided
    if (!reason || !startDate || !endDate) {
      return res
        .status(400)
        .json({
          msg: "Please provide all fields: reason, start date, and end date.",
        });
    }
    console.log(reason, startDate, endDate);

    // Check if startDate and endDate are valid dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res
        .status(400)
        .json({ msg: "Please provide valid dates for start and end date." });
    }

    // Ensure endDate is not before startDate
    if (end < start) {
      return res
        .status(400)
        .json({ msg: "End date cannot be before start date." });
    }

    // Create a new leave request
    const leaveRequest = new leaveReqModel({
      user: userId,
      reason,
      startDate: start,
      endDate: end,
      status: "Pending", // Default status for new requests
    });

    await leaveRequest.save();

    res.status(201).json({
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    next(error);
  }
};

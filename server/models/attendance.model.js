import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  }, // Store attendance by date
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Present",
  },
});

const attendanceModel = mongoose.model("Attendance", attendanceSchema);
export default attendanceModel;

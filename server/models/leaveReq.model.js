import mongoose from "mongoose";

const leaveReqSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending", // Default status when a leave request is created
    },
  },
  { timestamps: true }
);

export const leaveReqModel = mongoose.model("LeaveRequest", leaveReqSchema);

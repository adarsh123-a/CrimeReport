import mongoose from "mongoose";

const officerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation",
      required: true,
    },
    badgeNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rank: {
      type: String,
      enum: ["CONSTABLE", "INSPECTOR", "SUB_INSPECTOR", "COMMISSIONER"],
      default: "SUB_INSPECTOR",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    casesResolvedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Officer = mongoose.model("Officer", officerSchema);

import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: String,
    fileType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "DOCUMENT"],
      default: "IMAGE",
    },
    mimeType: String,
    fileSize: Number,
    description: String,
  },
  { timestamps: true }
);

export const Evidence = mongoose.model("Evidence", evidenceSchema);

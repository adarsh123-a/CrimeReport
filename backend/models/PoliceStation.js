import mongoose from "mongoose";

const policeStationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
      unique: true,
    },
    stationCode: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    contactPhone: String,
    contactEmail: String,
    location: {
      address: String,
      lat: Number,
      lng: Number,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const PoliceStation = mongoose.model("PoliceStation", policeStationSchema);

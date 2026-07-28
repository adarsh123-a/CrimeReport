import mongoose from "mongoose";

const witnessSchema = new mongoose.Schema({
  name: String,
  phone: String,
  Adhar: String,
  statement: String,
});

const firSchema = new mongoose.Schema({
  firNumber: String,
  filedDate: Date,
  filedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  summary: String,
});

const caseSchema = new mongoose.Schema(
  {
    complaintNumber: {
      type: String,
      default: function () {
        return this.caseId || `CR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      },
    },
    caseId: {
      type: String,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    fatherName: String,
    category: String,
    incidentType: String,
    typeOfCrime: String,
    date: String,
    crimeDate: String,
    time: String,
    location: String,
    crimeLocation: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    gender: String,
    description: {
      type: String,
      default: "Crime report submitted",
    },
    evidence: String,
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      default: "MEDIUM",
    },
    status: {
      type: String,
      default: "Open",
    },
    lawyer: {
      name: String,
      phone: String,
    },
    assignedOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation",
    },
    witnesses: [witnessSchema],
    suspectDetails: {
      name: String,
      description: String,
      vehicleNumber: String,
    },
    victimDetails: {
      name: String,
      phone: String,
      age: Number,
    },
    firDetails: firSchema,
    investigationNotes: [
      {
        note: String,
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    aiPrediction: {
      predictedCategory: String,
      confidenceScore: Number,
      spamLikelihood: Number,
    },
  },
  {
    timestamps: true,
  }
);

caseSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.firebaseKey = ret._id.toString();
    ret.id = ret._id.toString();
    ret.complaintNumber = ret.complaintNumber || ret.caseId || ret._id.toString();
    ret.name = ret.name || (ret.citizenId ? ret.citizenId.name : "Anonymous User");
    ret.typeOfCrime = ret.typeOfCrime || ret.incidentType || ret.category || "General Crime";
    ret.incidentType = ret.typeOfCrime;
    ret.date = ret.date || ret.crimeDate || (ret.createdAt ? ret.createdAt.toISOString().split("T")[0] : "");
    ret.location = ret.location || ret.crimeLocation || "Location Not Specified";
    return ret;
  },
});

export const Case = mongoose.model("Case", caseSchema);

import express from "express";
import { Case } from "../models/Case.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Helper to generate unique complaint numbers
const generateComplaintNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `CR-${year}-${randomNum}`;
};

// @route   GET /api/cases
// @desc    Get all cases with filtering, search, and pagination
router.get("/", async (req, res) => {
  try {
    const { search, status, priority, category, city } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (city) query["location.city"] = new RegExp(city, "i");

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { complaintNumber: searchRegex },
        { caseId: searchRegex },
        { name: searchRegex },
        { fatherName: searchRegex },
        { incidentType: searchRegex },
        { typeOfCrime: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    const cases = await Case.find(query)
      .populate("citizenId", "name email phone")
      .populate("assignedOfficerId", "name email phone")
      .populate("stationId", "stationName stationCode")
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    console.error("Get cases error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/cases/track/:complaintNumber
// @desc    Public / Citizen complaint status tracker
router.get("/track/:complaintNumber", async (req, res) => {
  try {
    const caseReport = await Case.findOne({
      $or: [
        { complaintNumber: req.params.complaintNumber },
        { caseId: req.params.complaintNumber },
      ],
    })
      .populate("assignedOfficerId", "name phone avatar")
      .populate("stationId", "stationName contactPhone location");

    if (!caseReport) {
      return res.status(404).json({ message: "Complaint report not found" });
    }

    res.json(caseReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cases
// @desc    Submit a new Crime Report
router.post("/", async (req, res) => {
  try {
    const {
      name,
      fatherName,
      incidentType,
      category,
      date,
      time,
      location,
      gender,
      description,
      evidence,
      isAnonymous,
      isEmergency,
      priority,
      coordinates,
      suspectDetails,
      victimDetails,
    } = req.body;

    const complaintNum = generateComplaintNumber();

    const newCase = new Case({
      complaintNumber: complaintNum,
      caseId: complaintNum,
      citizenId: req.user ? req.user._id : null,
      name: isAnonymous ? "Anonymous Citizen" : (name || (req.user ? req.user.name : "Anonymous User")),
      fatherName: fatherName || "",
      category: category || incidentType || "General Offense",
      incidentType: incidentType || category || "General Offense",
      typeOfCrime: incidentType || category || "General Offense",
      date: date || new Date().toISOString().split("T")[0],
      crimeDate: date || new Date().toISOString().split("T")[0],
      time: time || "Not Specified",
      location: location || "Not Specified",
      crimeLocation: location || "Not Specified",
      coordinates: coordinates || { lat: 28.6139, lng: 77.209 },
      gender: gender || "Other",
      description: description || "Crime report submitted",
      evidence: evidence || "",
      isAnonymous: Boolean(isAnonymous),
      isEmergency: Boolean(isEmergency),
      priority: priority || (isEmergency ? "CRITICAL" : "MEDIUM"),
      status: "PENDING",
      witnesses: [],
      suspectDetails: suspectDetails || {},
      victimDetails: victimDetails || {},
    });

    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    console.error("Create case error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/cases/:id
// @desc    Update case details, status, officer assignment, or witnesses
router.patch("/:id", async (req, res) => {
  try {
    const identifier = req.params.id;
    let targetCase = null;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      targetCase = await Case.findById(identifier);
    }

    if (!targetCase) {
      targetCase = await Case.findOne({
        $or: [{ complaintNumber: identifier }, { caseId: identifier }],
      });
    }

    if (!targetCase) {
      return res.status(404).json({ message: "Crime report not found" });
    }

    if (!targetCase.complaintNumber) {
      targetCase.complaintNumber = targetCase.caseId || generateComplaintNumber();
    }
    if (!targetCase.description) {
      targetCase.description = "Crime report details";
    }

    if (req.body.status) targetCase.status = req.body.status;
    if (req.body.priority) targetCase.priority = req.body.priority;
    if (req.body.lawyer) targetCase.lawyer = req.body.lawyer;
    if (req.body.assignedOfficerId) targetCase.assignedOfficerId = req.body.assignedOfficerId;
    if (req.body.stationId) targetCase.stationId = req.body.stationId;
    if (req.body.witnesses) targetCase.witnesses = req.body.witnesses;
    if (req.body.firDetails) targetCase.firDetails = req.body.firDetails;
    if (req.body.investigationNote) {
      targetCase.investigationNotes.push({
        note: req.body.investigationNote,
        addedBy: req.user ? req.user._id : null,
      });
    }

    const updatedCase = await targetCase.save();
    res.json(updatedCase);
  } catch (error) {
    console.error("Update case error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

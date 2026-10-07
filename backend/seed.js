import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Case } from "./models/Case.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crimereport"
    );
    console.log("Connected to MongoDB for enterprise seeding...");

   
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("password123", salt);

    const testUsers = [
      {
        name: "Super Admin",
        email: "superadmin@crimereport.org",
        password: defaultPassword,
        role: "SUPER_ADMIN",
        isVerified: true,
      },
      {
        name: "Station Inspector Sharma",
        email: "admin@station1.org",
        password: defaultPassword,
        role: "STATION_ADMIN",
        isVerified: true,
      },
      {
        name: "Officer Detective Alan Reed",
        email: "officer@station1.org",
        password: defaultPassword,
        role: "POLICE_OFFICER",
        isVerified: true,
      },
      {
        name: "Citizen John Doe",
        email: "citizen@example.com",
        password: defaultPassword,
        role: "CITIZEN",
        isVerified: true,
      },
    ];

    for (const u of testUsers) {
      await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
    }
    console.log("Default Role Users Seeded successfully!");

    // Seed Sample Enterprise Reports
    const existingCasesCount = await Case.countDocuments();
    if (existingCasesCount === 0) {
      const sampleCases = [
        {
          complaintNumber: "CR-2026-1001",
          caseId: "CR-2026-1001",
          name: "John Doe",
          fatherName: "Robert Doe",
          category: "Burglary",
          incidentType: "Burglary",
          typeOfCrime: "Burglary",
          date: "2026-03-10",
          time: "23:45",
          location: "123 Main Street, Downtown",
          gender: "Male",
          description: "Broke front door lock and stolen laptops and cash.",
          evidence: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600",
          priority: "HIGH",
          status: "INVESTIGATING",
          isEmergency: false,
          witnesses: [
            {
              name: "Emily Smith",
              phone: "+1-202-555-0123",
              Adhar: "123456789012",
              statement: "Saw suspicious silver car parked outside at 11:30 PM.",
            },
          ],
        },
        {
          complaintNumber: "CR-2026-1002",
          caseId: "CR-2026-1002",
          name: "Anonymous Citizen",
          category: "Cybercrime",
          incidentType: "Cybercrime",
          typeOfCrime: "Cybercrime",
          date: "2026-04-12",
          time: "14:15",
          location: "Online Banking Scam",
          gender: "Female",
          description: "Phishing email lured transfer of $5,000 to unauthorized account.",
          priority: "CRITICAL",
          status: "PENDING",
          isAnonymous: true,
          isEmergency: true,
        },
      ];

      await Case.insertMany(sampleCases);
      console.log("Sample Enterprise Cases Seeded!");
    }

    console.log("Seeding finished cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();

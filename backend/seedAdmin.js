import mongoose from "mongoose";
import Admin from "./models/admin.js"; 


const seedAdmin = async () => {
  try {
    // FACT: Make sure your PRODUCTION Atlas string is inside these quotes
    await mongoose.connect("mongodb+srv://Demonk6power:Iam%40ssasin1@clusterd.08y7vwm.mongodb.net/JobOne?retryWrites=true&w=majority&appName=ClusterD");
    
    const existingAdmin = await Admin.findOne({ email: "rawalkundan987@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists! Please delete it from MongoDB Atlas first.");
      process.exit();
    }

    const masterAdmin = new Admin({
      name: "Super Admin",
      email: "rawalkundan987@gmail.com",
      password: "Iam@ssasin1", // FACT: Passing plain text. The Mongoose model will securely hash it ONCE.
      role: "superadmin"
    });

    await masterAdmin.save();
    console.log("SUCCESS: Master Admin created in Production with a single, valid cryptographic hash.");
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  companyName: { type: String, default:""},
  createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  description: { type: String },
  profilePicture: { type: String },
  isProfileComplete:{ type: Boolean,default:false},
  companyWebsite: { type: String, default: "", trim: true },
  
  // Keep the string for legacy, but add the structured GeoJSON for the new feature
  location: { type: String, default: "" },
  officeLocation: {
    type: { type: String, enum: ['Point'], required: false },
    coordinates: { type: [Number], required: false, default: undefined },
    address: { type: String, default: "" } 
  },

  industry: { type: String, default: "" },
  googleId: { type: String }, 
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  isVerified: { type: Boolean, default: false },
  ratingsReceived:[
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
    }
  ],
  verificationDocument: { type: String, default: "" },
}, { timestamps: true });

const Employer = mongoose.model("Employer", employerSchema);
export default Employer;
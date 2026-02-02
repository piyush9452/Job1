import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Loader2,
  Save,
  ArrowLeft,
  Building,
  Globe,
  MapPin,
  Phone,
  FileText,
  Image as ImageIcon,
  Briefcase,
  User,
  AlertTriangle,
  X,
} from "lucide-react";

export default function EmployerEditProfile() {
  const navigate = useNavigate();
  const location = useLocation(); // Required to read the 'showWarning' flag

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- POPUP STATE ---
  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    name: "", // Contact person name
    phone: "",
    companyWebsite: "",
    location: "",
    industry: "",
    description: "",
    profilePicture: "",
  });

  // --- 1. HANDLE POPUP & LOAD DATA ---
  useEffect(() => {
    // Check if redirected from Google Login with incomplete profile
    if (location.state?.showWarning) {
      setShowPopup(true);
    }

    const loadProfile = async () => {
      try {
        const stored = localStorage.getItem("employerInfo");
        if (!stored) {
          navigate("/login");
          return;
        }

        const dataset = JSON.parse(stored);
        const token = dataset.token;
        const employerID = dataset.id || dataset.employerId;

        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/employer/profile/${employerID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setForm({
          companyName: data.companyName || "",
          name: data.name || "",
          phone: data.phone ? String(data.phone) : "",
          companyWebsite: data.companyWebsite || "",
          location: data.location || "",
          industry: data.industry || "",
          description: data.description || "",
          profilePicture: data.profilePicture || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, location]);

  // --- 2. HANDLERS ---
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // STRICT CHECK: Ensure critical fields are filled before saving
    if (!form.companyName?.trim() || !form.phone?.trim()) {
      alert("Company Name and Phone Number are mandatory.");
      return;
    }

    setSaving(true);

    try {
      const stored = localStorage.getItem("employerInfo");
      const token = stored ? JSON.parse(stored).token : null;

      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      await axios.post(
        "https://jobone-mrpy.onrender.com/employer/updateProfile",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Profile updated successfully!");
      navigate(`/employerprofile`);
    } catch (err) {
      console.error("Update failed:", err);
      alert(
        "Failed to update profile: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-500 gap-2">
        <Loader2 className="animate-spin" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 relative">
      {/* --- STRICT POPUP MODAL --- */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border-t-4 border-red-500 transform scale-100 transition-all">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Profile Incomplete
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                To start posting jobs, we need a few more details:
                <br />
                <br />
                <ul className="text-left bg-gray-50 p-3 rounded-lg border border-gray-100 list-disc list-inside">
                  <li>
                    <strong>Company Name</strong> (Required)
                  </li>
                  <li>
                    <strong>Phone Number</strong> (Required for candidates)
                  </li>
                </ul>
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors w-full shadow-lg shadow-red-200"
              >
                Okay, I'll update it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN FORM --- */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Edit Company Profile
            </h1>
            <p className="text-sm text-slate-500">
              Update your business details and contact info
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium bg-slate-50 px-3 py-2 rounded-lg transition-colors border border-slate-200 hover:bg-slate-100"
          >
            <ArrowLeft size={16} /> Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Building size={16} className="text-blue-500" /> Company Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={onChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="e.g. Tech Solutions Inc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Contact Person
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Phone size={16} className="text-blue-500" /> Phone Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition relative"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Section 2: Online Presence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Globe size={16} className="text-blue-500" /> Website
              </label>
              <input
                name="companyWebsite"
                value={form.companyWebsite}
                onChange={onChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-500" /> Logo URL
              </label>
              <input
                name="profilePicture"
                value={form.profilePicture}
                onChange={onChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="https://image-url.com/logo.png"
              />
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" /> Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                <Briefcase size={16} className="text-blue-500" /> Industry
              </label>
              <input
                name="industry"
                value={form.industry}
                onChange={onChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="e.g. Software, Finance"
              />
            </div>
          </div>

          {/* Section 4: About */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" /> About Company
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none h-40 resize-y transition leading-relaxed"
              placeholder="Tell candidates about your company culture and mission..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

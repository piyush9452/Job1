import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DocumentUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    setLoading(true);

    try {
      // 1. Get the token from storage
      const userInfo = JSON.parse(localStorage.getItem("employerInfo"));
      const token = userInfo?.token;

      if (!token) {
        setLoading(false);
        alert("You must be logged in to do this.");
        navigate("/login"); // Redirect to login
        return;
      }

      // --- STEP 1: Get the Presigned URL from YOUR backend ---
      const res = await axios.post(
        "http://localhost:5000/employer/generate-upload-url",
        {}, // No body needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { uploadUrl, key } = res.data;

      // --- STEP 2: Upload the file DIRECTLY to S3 ---
      // This is a common point of failure. S3 can be very strict about headers.
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // --- STEP 3: Tell YOUR backend the upload is complete ---
      const saveRes = await axios.patch(
        "http://localhost:5000/employer/save-document-key",
        { key: key }, // Send the key of the file
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);
      alert("Upload successful! Your document is pending review.");
      console.log("Final URL:", saveRes.data.documentUrl);
      navigate("/employer-dashboard"); // Redirect to their dashboard
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Upload failed. See console for details.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Upload Verification Document</h2>
      <p>
        Please upload a PDF, JPG, or PNG of your company registration or other
        verifying document.
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        {loading ? "Uploading..." : "Upload and Submit"}
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployerDOC.css";

export default function EmployerDocumentManager() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- STATE FOR PERSISTENCE ---
  const [isUploaded, setIsUploaded] = useState(false); // Controls button visibility
  const [viewUrl, setViewUrl] = useState(null); // Controls iframe visibility
  const [currentFileName, setCurrentFileName] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Base API URL
  const API_BASE = "https://jobone-mrpy.onrender.com/employer";

  // Helper to get headers
  const getAuthHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("employerInfo"));
    const token = userInfo?.token;
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  };

  // --- 1. ON PAGE LOAD: CHECK MONGODB ---
  useEffect(() => {
    const checkDatabaseForDoc = async () => {
      const headers = getAuthHeader();
      if (!headers) return;

      try {
        // We try to get a view URL.
        // If the backend sends 200, it means 'employer.verificationDocument' exists.
        const res = await axios.get(`${API_BASE}/documentViewUrl`, { headers });

        if (res.data.viewableUrl) {
          setIsUploaded(true); // <--- THIS MAKES BUTTONS VISIBLE ON RELOAD

          // Optional: Parse the S3 URL to show a fake filename to the user
          // S3 URL format: .../doc-ID-RANDOM.pdf?...
          const urlObj = new URL(res.data.viewableUrl);
          // Get the part after the last slash
          const cleanName = urlObj.pathname.split("/").pop();
          setCurrentFileName(cleanName);
        }
      } catch (error) {
        // If 404, it simply means no document is saved in MongoDB yet.
        if (error.response && error.response.status === 404) {
          setIsUploaded(false);
        }
      }
    };

    checkDatabaseForDoc();
  }, []); // Empty dependency array = runs once on mount

  // --- 2. UPLOAD LOGIC ---
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage({ type: "", text: "" });
  };

  const handleUpload = async () => {
    if (!file)
      return setMessage({ type: "error", text: "Select a file first." });
    setLoading(true);

    try {
      const headers = getAuthHeader();
      // A. Get URL
      const presignRes = await axios.post(
        `${API_BASE}/generate-upload-url`,
        { fileType: file.type },
        { headers }
      );

      // B. Upload to AWS
      await axios.put(presignRes.data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      // C. Save Key to MongoDB
      await axios.patch(
        `${API_BASE}/save-document-key`,
        { key: presignRes.data.key },
        { headers }
      );

      setMessage({ type: "success", text: "Upload complete!" });
      setFile(null);

      // Update state immediately so buttons appear without reload
      setIsUploaded(true);
      setCurrentFileName(file.name);
    } catch (error) {
      setMessage({ type: "error", text: "Upload failed." });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. VIEW LOGIC ---
  const handleView = async () => {
    if (viewUrl) {
      setViewUrl(null);
      return;
    } // Toggle off

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/documentViewUrl`, {
        headers: getAuthHeader(),
      });
      setViewUrl(res.data.viewableUrl);
    } catch (error) {
      setMessage({ type: "error", text: "Could not fetch document." });
    } finally {
      setLoading(false);
    }
  };

  // --- 4. DOWNLOAD LOGIC ---
  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/documentDownloadUrl`, {
        headers: getAuthHeader(),
      });
      // Create invisible link to trigger download
      const link = document.createElement("a");
      link.href = res.data.downloadableUrl;
      // 'download' attribute is a hint, S3 content-disposition does the real work
      link.setAttribute("download", "verification-document");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMessage({ type: "error", text: "Download failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-30">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Employer Verification
      </h2>

      {/* Status Bar */}
      {isUploaded ? (
        // --- SUCCESS STATE ---
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md mb-8">
          <div className="flex items-center gap-4 w-full">
            {/* Icon Circle */}
            <div className="p-3 bg-green-100 text-green-600 rounded-full shrink-0">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Text Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-base">
                  Verification Document
                </h3>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-full border border-green-200">
                  Active
                </span>
              </div>
              {currentFileName ? (
                <p
                  className="text-sm text-gray-500 font-mono mt-1 truncate"
                  title={currentFileName}
                >
                  {currentFileName}
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1 italic">
                  Filename unavailable
                </p>
              )}
              <p className="text-xs text-green-600 mt-0.5">
                Successfully stored on secure cloud.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // --- WARNING STATE ---
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4 mb-8">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full shrink-0 ">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-base">
              Action Required
            </h3>
            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
              No verification document found. Please upload a valid government
              ID or business registration to verify your employer account.
            </p>
          </div>
        </div>
      )}

      {/* Upload Input */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-4
          ${
            file
              ? "border-blue-400 bg-blue-50/50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
      >
        {/* HIDDEN INPUT */}
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept=".pdf, .jpg, .jpeg, .png"
          className="hidden"
        />

        {/* CUSTOM LABEL AS BUTTON */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
        >
          {/* Icon */}
          <div className="p-4 bg-white rounded-full shadow-sm mb-2">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Text Logic */}
          {file ? (
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600 break-all">
                {file.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-xs text-blue-400 mt-2 underline">
                Click to change file
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">
                Click to upload document
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PDF, JPG, or PNG (Max 5MB)
              </p>
            </div>
          )}
        </label>

        {/* UPLOAD BUTTON (Only shows when file is selected) */}
        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-4 px-8 py-2.5 rounded-lg font-medium shadow-md text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload Document"
            )}
          </button>
        )}
      </div>

      {/* ACTION BUTTONS - Always visible if isUploaded is true */}
      {isUploaded && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <button onClick={handleView} className="button">
            {viewUrl ? (
              <div className="flex flex-row justify-center items-center">
                <img
                  src="https://res.cloudinary.com/dsswbc0tx/image/upload/v1763473125/icons8-view-100_x0nubf.png"
                  className="eyeimgsize"
                />
                <p>Close Preview</p>
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center">
                <img
                  src="https://res.cloudinary.com/dsswbc0tx/image/upload/v1763473125/icons8-view-100_x0nubf.png"
                  className="eyeimgsize"
                />
                <p>View Document</p>
              </div>
            )}
          </button>

          <button onClick={handleDownload} className="button ">
            <svg
              stroke-linejoin="round"
              stroke-linecap="round"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              height="40"
              width="40"
              class="button__icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
              <path d="M7 11l5 5l5 -5"></path>
              <path d="M12 4l0 12"></path>
            </svg>
            <span class="button__text">
              {loading ? "Downloading..." : "Download Document"}
            </span>
          </button>
        </div>
      )}

      {/* Message Area */}
      {message.text && (
        <div
          className={`mt-4 p-3 rounded text-sm text-center ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Document Preview Iframe/Image */}
      {viewUrl && (
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden shadow-inner">
          <div className="h-[600px] bg-gray-50 flex items-center justify-center">
            {viewUrl.includes(".pdf") ? (
              <iframe
                src={viewUrl}
                title="Document"
                className="w-full h-full"
              />
            ) : (
              <img
                src={viewUrl}
                alt="Document"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

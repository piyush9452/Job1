import { useState, useEffect } from "react";
import axios from "axios";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("RAW TOKEN:", localStorage.getItem("userToken"));
    console.log("RAW USER INFO:", localStorage.getItem("userInfo"));

    try {
      console.log("PARSED USER:", JSON.parse(localStorage.getItem("userInfo")));
    } catch (e) {
      console.log("ERROR PARSING USER:", e);
    }
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const user = JSON.parse(localStorage.getItem("userInfo"));
        const userId = user?.userId;

        if (!token || !userId) {
          alert("Please log in to view your applications.");
          return;
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/applications/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API DATA:", data);
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading your applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Applications Found
          </h2>
          <p className="text-gray-500 mt-2">
            You haven't applied for any jobs yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          My Applications
        </h2>

        <div className="grid gap-6">
          {applications.map((app) => (
            <div
              key={app.applicationId} // <-- Use applicationId as key
              className="p-5 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {app.job?.title || "Job Title Unavailable"}{" "}
                  {/* <-- access job correctly */}
                </h3>
                <p className="text-gray-600">
                  {app.job?.companyName || "Unknown Company"}
                </p>
                <p className="text-gray-500 text-sm">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold mt-3 md:mt-0 ${
                  app.status === "applied"
                    ? "bg-blue-100 text-blue-700"
                    : app.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

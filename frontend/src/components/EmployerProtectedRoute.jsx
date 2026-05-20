import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EmployerProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState("loading");
  const storedData = localStorage.getItem("employerInfo");

  useEffect(() => {
    const verifyStatus = async () => {
      // 1. If no token, redirect immediately
      if (!storedData) {
        setIsAuthorized("unauthorized");
        return;
      }

      try {
        const { token } = JSON.parse(storedData);

        // 2. USE THE CORRECT URL (mrpy)
        const { data } = await axios.get(
          "https://jobone-mrpy.onrender.com/employer/check-eligibility",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // 3. Logic based on the response structure you shared
        if (data.isFrozen || data.access === "blocked") {
          alert(data.message || "Your account access is restricted.");
          setIsAuthorized("unauthorized");
        } else {
          setIsAuthorized("authorized");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthorized("unauthorized");
      }
    };
    verifyStatus();
  }, [storedData]);

  if (isAuthorized === "loading")
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (isAuthorized === "unauthorized") return <Navigate to="/login" />;
  return children;
};
export default EmployerProtectedRoute;

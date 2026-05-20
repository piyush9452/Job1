import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EmployerProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState("loading");
  const storedData = localStorage.getItem("employerInfo");

  useEffect(() => {
    const verifyStatus = async () => {
      if (!storedData) {
        setIsAuthorized("unauthorized");
        return;
      }

      try {
        const { token } = JSON.parse(storedData);

        // 1. We expect a response here.
        const { data } = await axios.get(
          "https://jobone-mrpy.onrender.com/employer/check-eligibility",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        // 2. Logic: The API returned 200, so we check the access field.
        if (data.access === "blocked") {
          // CHANGE: Do NOT redirect to login. Just let them in.
          // The CreateJob page itself will handle the "Posting Disabled" warning.
          setIsAuthorized("authorized");
        } else {
          setIsAuthorized("authorized");
        }
      } catch (err) {
        // 3. FACT: Distinguish between being logged out (401) and being banned (403)
        const status = err.response?.status;

        if (status === 403) {
          // Backend middleware blocked the request (likely frozen)
          alert(err.response.data.message || "Access Forbidden.");
          setIsAuthorized("unauthorized");
        } else {
          // 401 Unauthorized or other errors (token expired, server down)
          localStorage.removeItem("employerInfo"); // Clean up dead token
          setIsAuthorized("unauthorized");
        }
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

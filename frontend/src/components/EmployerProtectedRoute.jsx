import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function EmployerProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!JSON.parse(localStorage.getItem("employerInfo"))
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!JSON.parse(localStorage.getItem("employerInfo")));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    if (!isAuthenticated) {
        alert("Please login as employer to continue");
        return <Navigate to="/login" replace />;
    }

    return children;
}

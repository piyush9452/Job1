import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!JSON.parse(localStorage.getItem("userInfo"))
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!JSON.parse(localStorage.getItem("userInfo")));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    if (!isAuthenticated) {
        alert("Please login to continue");
        return <Navigate to="/login" replace />;
    }

    return children;
}

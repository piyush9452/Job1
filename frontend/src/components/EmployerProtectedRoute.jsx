import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const location = useLocation();

    // Your app stores user authenticity ONLY using userToken
    const token = localStorage.getItem("employerToken");

    // Authenticated only if token exists
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import login from "../assets/login.jpg";


const RegisterOption = () => {
    const navigate = useNavigate();

    const handleGoogleSignup = () => {
        // You can replace this alert with actual Google Auth (Firebase or backend route)
        alert("Google signup coming soon!");
    };

    const handleEmailSignup = () => {
        navigate("/userregister"); // 👈 goes to your existing email registration page
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4" style={{ backgroundImage: `url(${login})` }}>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Sign-up and apply for free
                </h1>
                <p className="text-gray-600 text-lg">
                    3,00,000+ employers hiring on <span className="font-semibold">First Job</span>
                </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
                {/* Google Sign-up */}
                <button
                    onClick={handleGoogleSignup}
                    className="flex items-center justify-center w-full py-3 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                >
                    <FcGoogle className="text-2xl mr-2 bg-white rounded-full p-1" />
                    Sign up with Google
                </button>

                {/* OR Divider */}
                <button
                    onClick={handleEmailSignup}
                    className="w-full py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium text-gray-700"
                >
                    Sign up with Email
                </button>


                {/* Terms */}
                <p className="text-sm text-gray-500 mt-4">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                        Terms and Conditions
                    </Link>.
                </p>

                {/* Login link */}
                <p className="mt-3 text-gray-600 text-sm">
                    Already registered?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterOption;

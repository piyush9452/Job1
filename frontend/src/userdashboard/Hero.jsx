import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/backgroundImage.png"; // replace with your animated image or Lottie later

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-blue-50 py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10">

            {/* LEFT CONTENT */}
            <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800">
                    Build Your Career with
                    <span className="text-blue-600"> JobOne</span>
                </h1>

                <p className="mt-4 text-gray-600 text-lg">
                    Create an impressive profile, showcase your skills, and get discovered by top employers.
                </p>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => navigate("/profile")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        Go to Profile
                    </button>

                    <button
                        onClick={() => navigate("/jobs")}
                        className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-100"
                    >
                        Browse Jobs
                    </button>
                </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex-1 flex justify-center">
                <img
                    src={backgroundImage}
                    alt="Hero Illustration"
                    className="w-[300px] md:w-[420px]"
                />
            </div>

        </div>
    );
};

export default Hero;

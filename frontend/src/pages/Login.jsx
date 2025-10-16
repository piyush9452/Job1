import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("https://jobone-mrpy.onrender.com/user/login", { email, password });
            // Assuming backend sends back a token
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/"); // Redirect after login
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    New user?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}

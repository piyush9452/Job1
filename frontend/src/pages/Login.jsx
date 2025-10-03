import { Link }  from "react-router-dom";

export default function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <form className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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

                {/* Link to Register */}
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

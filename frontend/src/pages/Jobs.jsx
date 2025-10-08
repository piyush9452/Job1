import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaHome, FaClock } from "react-icons/fa";
import JobList from  "../components/JobList";



export default function Jobs() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get("title");
    const jobLocation = queryParams.get("location");
    const [stipend, setStipend] = useState(0);


    return (
        <div className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Results</h2>
            <p className="text-gray-600">
                Showing results for: <strong>{title || "Any Role"}</strong> in{" "}
                <strong>{jobLocation || "Any Location"}</strong>
            </p>
            <div className="flex min-h-screen">
                <aside className="w-1/4 bg-white shadow-md p-5 space-y-6 sticky top-0 h-screen">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-blue-600">⚙️</span> Filters
                    </h2>

                    <div>
                        <label className="block text-gray-600 mb-1">Profile</label>
                        <input
                            type="text"
                            placeholder="e.g. Marketing"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Delhi"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-blue-600" /> Work from home
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-blue-600" /> Part-time
                        </label>
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-2">
                            Desired minimum monthly stipend (₹)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="1000"
                            value={stipend}
                            onChange={(e) => setStipend(e.target.value)}
                            className="w-full accent-blue-600"
                        />
                        <p className="text-sm text-gray-500 mt-1">₹{stipend}</p>
                    </div>

                    <button className="text-blue-600 text-sm hover:underline">Clear all</button>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">Keyword Search</h3>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <input
                                type="text"
                                placeholder="e.g. Design, Infosys"
                                className="w-full px-3 py-2 rounded-l-lg focus:outline-none"
                            />
                            <button className="bg-blue-600 px-4 py-2 text-white rounded-r-lg">
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </aside>
                <JobList/>
            </div>
        </div>
    );
}

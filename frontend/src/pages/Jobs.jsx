import { useLocation } from "react-router-dom";

export default function Jobs() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get("title");
    const jobLocation = queryParams.get("location");

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Results</h2>
            <p className="text-gray-600">
                Showing results for: <strong>{title || "Any Role"}</strong> in{" "}
                <strong>{jobLocation || "Any Location"}</strong>
            </p>

            {/* Later you'll map job cards here based on API results */}
            <div className="mt-6">
                <p className="text-gray-500 italic">Job listings will appear here...</p>
            </div>
        </div>
    );
}

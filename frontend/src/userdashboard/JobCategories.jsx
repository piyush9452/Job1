import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
    { name: "Accounting", icon: "💼" },
    { name: "Marketing", icon: "📢" },
    { name: "Design", icon: "🎨" },
    { name: "Development", icon: "💻" },
    { name: "HR", icon: "🧑‍💼" },
    { name: "Automotive", icon: "🚗" },
    { name: "Customer Service", icon: "🎧" },
    { name: "Health Care", icon: "🏥" },
    { name: "Project Management", icon: "📂" },
];

export default function DashboardCategories() {
    const navigate = useNavigate();

    const handleClick = (category) => {
        navigate(`/jobs?title=${encodeURIComponent(category)}`);
    };

    return (
        <section className="py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Explore Job Categories
            </h2>

            <div className="flex flex-wrap gap-4">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(cat.name)}
                        className="flex items-center gap-3 px-5 py-3
                        bg-white border rounded-2xl shadow-sm
                        hover:shadow-md hover:bg-indigo-50
                        transition cursor-pointer min-w-[180px]"
                    >
                        <span className="text-2xl">{cat.icon}</span>

                        <span className="text-gray-700 font-medium">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

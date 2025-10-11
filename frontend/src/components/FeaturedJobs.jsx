import { FaLock, FaMapMarkerAlt, FaClock, FaGlobe } from "react-icons/fa";

const jobs = [
    {
        id: 1,
        title: "Software Engineer (Android), Libraries",
        company: "Segment",
        location: "London, UK",
        time: "11 hours ago",
        salary: "$35k - $45k",
        type: ["Full Time", "Private", "Urgent"],
        logo: "https://seeklogo.com/images/S/segment-logo-066EF74895-seeklogo.com.png"
    },
    {
        id: 2,
        title: "Recruiting Coordinator",
        company: "Catalyst",
        location: "London, UK",
        time: "8 hours ago",
        salary: "$32k - $40k",
        type: ["Freelancer", "Private", "Urgent"],
        logo: "https://seeklogo.com/images/C/catalyst-logo-0F527073CF-seeklogo.com.png"
    },
    {
        id: 3,
        title: "Product Manager, Studio",
        company: "Invision",
        location: "London, UK",
        time: "7 hours ago",
        salary: "$38k - $50k",
        type: ["Part Time", "Private", "Urgent"],
        logo: "https://cdn.worldvectorlogo.com/logos/invision-2.svg"
    },
    {
        id: 4,
        title: "Senior Product Designer",
        company: "Upwork",
        location: "London, UK",
        time: "6 hours ago",
        salary: "$45k - $60k",
        type: ["Temporary", "Private", "Urgent"],
        logo: "https://cdn.worldvectorlogo.com/logos/upwork.svg"
    },
    {
        id: 5,
        title: "Data Analyst",
        company: "Spotify",
        location: "London, UK",
        time: "9 hours ago",
        salary: "$50k - $65k",
        type: ["Full Time", "Urgent", "Private"],
        logo: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg"
    },
    {
        id: 6,
        title: "UI/UX Designer",
        company: "Figma",
        location: "London, UK",
        time: "10 hours ago",
        salary: "$40k - $55k",
        type: ["Part Time", "Private"],
        logo: "https://cdn.worldvectorlogo.com/logos/figma-1.svg"
    }
];

const badgeColors = {
    "Full Time": "bg-blue-100 text-blue-600",
    "Part Time": "bg-purple-100 text-purple-600",
    "Freelancer": "bg-indigo-100 text-indigo-600",
    "Temporary": "bg-cyan-100 text-cyan-600",
    "Private": "bg-green-100 text-green-600",
    "Urgent": "bg-yellow-100 text-yellow-600"
};

export default function FeaturedJobs() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-2">Featured Jobs</h2>
                <p className="text-gray-500 text-center mb-8">
                    Know your worth and find the job that qualifies your life
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4 hover:scale-105 transition"
                        >
                            <img
                                src={job.logo}
                                alt={job.company}
                                className="w-12 h-12 rounded-lg object-contain"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <p className="text-gray-500 text-sm">{job.company}</p>

                                <div className="flex items-center gap-4 text-gray-400 text-sm mt-2">
                  <span className="flex items-center gap-1">
                    <FaLock /> {job.company}
                  </span>
                                    <span className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                                    <span className="flex items-center gap-1">
                    <FaClock /> {job.time}
                  </span>
                                    <span className="flex items-center gap-1">
                    <FaGlobe /> {job.salary}
                  </span>
                                </div>

                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {job.type.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColors[tag]}`}
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Loader2,
  MapPin,
  Mail,
  Phone,
  User as UserIcon,
  Briefcase,
  Award,
  FileText,
  Edit,
  GraduationCap,
  Link as LinkIcon,
  Download,
} from "lucide-react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const storedString = localStorage.getItem("userInfo");
        if (!storedString) {
          navigate("/login");
          return;
        }

        let storedUser;
        try {
          storedUser = JSON.parse(storedString);
        } catch (e) {
          localStorage.removeItem("userInfo");
          navigate("/login");
          return;
        }
        const id = storedUser?.userId;

        if (!storedUser?.token || !id) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          `https://jobone-mrpy.onrender.com/user/${id}`,
          { headers: { Authorization: `Bearer ${storedUser.token}` } }
        );

        // Safe Parse
        const safeParse = (val) => {
          if (Array.isArray(val)) return val;
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch (e) {
              return [];
            }
          }
          return [];
        };

        setProfile({
          ...data,
          skills: safeParse(data.skills),
          experience: safeParse(data.experience),
          education: safeParse(data.education),
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [location, navigate]);

  if (loading)
    return (
      <div className="flex h-screen justify-center items-center text-slate-500 gap-2">
        <Loader2 className="animate-spin" /> Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* --- HEADER --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-12 mb-6 gap-6">
              <img
                src={
                  profile.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="User"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="flex-1 text-center md:text-left mb-2">
                <h1 className="text-3xl font-bold text-slate-900">
                  {profile.name}
                </h1>
                <p className="text-slate-500 font-medium">Job Seeker</p>
              </div>
              <button
                onClick={() => navigate("/editprofile")}
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-50 transition shadow-sm"
              >
                <Edit size={16} /> Edit Profile
              </button>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
              <ContactItem
                icon={<Mail size={18} />}
                label="Email"
                value={profile.email}
              />
              <ContactItem
                icon={<Phone size={18} />}
                label="Phone"
                value={profile.phone}
              />
              <ContactItem
                icon={<UserIcon size={18} />}
                label="User ID"
                value={profile._id}
                mono
              />
              {profile.resume && (
                <div
                  className="flex items-center gap-3 text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => window.open(profile.resume, "_blank")}
                >
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <LinkIcon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Resume
                    </p>
                    <p className="text-sm font-medium text-blue-600 hover:underline truncate w-32">
                      View Resume
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-1 space-y-6">
            <Card
              title="Skills"
              icon={<Award size={20} className="text-orange-500" />}
            >
              {profile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState text="No skills added." />
              )}
            </Card>

            <Card
              title="Education"
              icon={<GraduationCap size={20} className="text-green-500" />}
            >
              {profile.education?.length > 0 ? (
                <div className="space-y-6">
                  {profile.education.map((edu, i) => (
                    <div
                      key={i}
                      className="relative pl-4 border-l-2 border-green-200"
                    >
                      <h4 className="font-bold text-slate-800 text-sm">
                        {edu.degree}
                      </h4>
                      <p className="text-xs text-slate-500">{edu.university}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {edu.started} - {edu.ended} • CGPA: {edu.CGPA}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="No education listed." />
              )}
            </Card>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="About Me"
              icon={<FileText size={20} className="text-blue-500" />}
            >
              <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.description || (
                  <span className="italic text-slate-400">
                    No summary provided.
                  </span>
                )}
              </div>
            </Card>

            <Card
              title="Experience"
              icon={<Briefcase size={20} className="text-indigo-500" />}
            >
              {profile.experience?.length > 0 ? (
                <div className="space-y-8">
                  {profile.experience.map((exp, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">
                            {exp.role}
                          </h4>
                          <p className="text-indigo-600 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="No experience added." />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function ContactItem({ icon, label, value, mono }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-bold uppercase">{label}</p>
        <p
          className={`text-sm font-medium truncate ${
            mono ? "font-mono text-slate-500" : "text-slate-800"
          }`}
          title={value}
        >
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

export default Profile;

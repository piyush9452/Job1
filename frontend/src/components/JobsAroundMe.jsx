import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import {
  MapPin,
  Navigation,
  Loader2,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Fix Leaflet's default icon path issue in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom red icon for user location
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to recenter map when location changes
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 12);
  }, [lat, lng, map]);
  return null;
}

export default function JobsAroundMe() {
  const [userLocation, setUserLocation] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchNearbyJobs(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        if (err.code === 1) {
          setError(
            "Location permission denied. Please allow location access to find jobs near you."
          );
        } else {
          setError("Unable to retrieve your location. Please try again.");
        }
      }
    );
  };

  const fetchNearbyJobs = async (lat, lng) => {
    try {
      // Default radius: 50km
      const { data } = await axios.get(
        `https://jobone-mrpy.onrender.com/jobs/nearby?lat=${lat}&lng=${lng}&dist=50`
      );
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch nearby jobs", err);
      setError("Failed to find jobs in your area.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="text-blue-600" /> Jobs Around You
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Find opportunities within 50km of your current location.
          </p>
        </div>

        {!userLocation && (
          <button
            onClick={handleGetLocation}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Navigation size={18} />
            )}
            {loading ? "Locating..." : "Use My Location"}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm font-medium border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Map View */}
      {userLocation && (
        <div className="h-[400px] w-full z-0 relative border-b border-gray-100">
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

            {/* User Marker */}
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>You are here</Popup>
            </Marker>

            {/* Job Markers */}
            {jobs.map(
              (job) =>
                job.location?.coordinates && (
                  <Marker
                    key={job._id}
                    position={[
                      job.location.coordinates[1],
                      job.location.coordinates[0],
                    ]} // Mongo uses [Lng, Lat], Leaflet uses [Lat, Lng]
                  >
                    <Popup>
                      <div className="min-w-[150px]">
                        <h3 className="font-bold text-gray-800 text-sm">
                          {job.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {job.location.address}
                        </p>
                        <p className="text-blue-600 font-bold text-xs mt-1">
                          ₹{job.salary}
                        </p>
                        <button
                          onClick={() => navigate(`/job/${job._id}`)}
                          className="text-xs text-white bg-blue-600 px-2 py-1 rounded mt-2 w-full"
                        >
                          View Job
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>
        </div>
      )}

      {/* Jobs List */}
      <div className="p-6 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          {userLocation
            ? `${jobs.length} Jobs Found Nearby`
            : "Results will appear here"}
        </h3>

        {!userLocation ? (
          <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <MapPin size={32} className="mx-auto mb-2 opacity-50" />
            <p>Click "Use My Location" to see jobs on the map.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No jobs found within 50km. Try searching a different area.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/job/${job._id}`)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                  {job.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 mb-3">
                  <MapPin size={12} />
                  <span className="truncate">
                    {typeof job.location === "object"
                      ? job.location.address
                      : job.location}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium capitalize">
                    {job.jobType}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                    <IndianRupee size={14} className="text-gray-400" />
                    {job.salary ? job.salary.toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

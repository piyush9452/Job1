import axios from "axios";
import React, { useEffect, useState } from "react";

const ProfileDescr = () => {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (!storedUser || !storedUser.user) {
          alert("Please log in first!");
          setLoading(false);
          return;
        }

        const userId = storedUser.user.id; // ✅ correct key
        const token = storedUser.token; // ✅ token comes from userInfo

        if (!userId || !token) {
          alert("Invalid user session");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `http://localhost:5000/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const returnWorkExperience = (count) => {
    if (count > 0 && profile.experience !== undefined) {
      return (
        <ul className="ml-3">
          {profile.experience.map((every) => (
            <>
              <li>
                <h1 className="font-semibold text-2xl mt-2">{every.role}</h1>
                <p className="font-normal ">{every.company}</p>
                <p>{every.duration}</p>
                <p className="font-normal text-2xl mt-2 mb-6">
                  {every.description}
                </p>
              </li>
              <hr />
            </>
          ))}
        </ul>
      );
    } else {
      return <div>No Experience Found</div>;
    }
  };

  const returnSkills = (count) => {
    if (count > 0 && profile.skills !== undefined) {
      return (
        <ul className="flex flex-row flex-wrap gap-3.5 ">
          {profile.skills.map((every) => (
            <>
              <li className="px-2.5 py-2 bg-blue-300 text-blue-700 font-semibold rounded-[10px] border-2 border-blue-700">
                {every}
              </li>
            </>
          ))}
        </ul>
      );
    } else {
      return <div>No Skills Listed</div>;
    }
  };

  const returnEdu = (count) => {
    if (count > 0 && profile.education !== undefined) {
      return (
        <ul>
          {profile.education.map((every) => (
            <>
              <li>
                <div className="flex justify-between">
                  <h1 className="font-semibold text-2xl">{every.degree}</h1>
                  <div className="flex justify-between">
                    <p>{every.started}</p>
                    <p className="ml-4 mr-4 font-semibold">to</p>
                    <p>{every.ended}</p>
                  </div>
                </div>
                <p className="font-semibold ">{every.university}</p>

                <p className="font-semibold text-xl mb-3">{every.CGPA}</p>
              </li>
              <hr />
            </>
          ))}
        </ul>
      );
    } else {
      return <div>No Education Found</div>;
    }
  };

  return (
    <div className="flex content-center  w-[100vw]  p-16 ">
      <div className="w-[400px] ">
        <div className="w-[400px] bg-blue-50 p-4 mr-5 mb-3 rounded-2xl flex items-center justify-center">
          <div className="flex gap-4 flex-col items-center justify-center">
            <img
              src={`${"nothing"}`}
              className="w-[100px] h-[100px] rounded-full self-center"
            />
            <div className="text-center">
              <p className="text-xl">Welcome!</p>
              <h3 className="text-4xl font-semibold">{profile.name}</h3>
            </div>
          </div>
        </div>
        <div className="w-[400px] bg-blue-50 p-4 mr-5 rounded-2xl items-center justify-center">
          <h1 className="text-2xl text-center">Elementary Details</h1>
          <div className=" p-2.5 m-2.5">
            <ul>
              <li className="bg-white mt-2.5 p-2.5">{`Phone Number : ${profile.phone}`}</li>
              <li className="bg-white mt-2.5 p-2.5">{`Email : ${profile.email}`}</li>
              <li className="bg-white mt-2.5 p-2.5">{`JobOne ID : ${profile._id}`}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-[100%]  ml-5 bg-blue-50 p-8">
        <h1 className="text-4xl text-center mb-5 font-semibold">
          Professional Profile
        </h1>
        <div className="bg-white p-4 min-h-[200px] rounded-xl mb-3">
          <h1 className="text-3xl  mb-5 font-semibold">Professional Summary</h1>
          <p className="">{profile.description}</p>
        </div>
        <div className="bg-white p-4 min-h-[150px] rounded-xl mb-3">
          <h1 className="text-3xl  mb-5 font-semibold">Work Experience</h1>
          {returnWorkExperience(
            profile.experience !== undefined ? profile.experience.length : 0
          )}
        </div>
        <div className="bg-white p-4 min-h-[150px] rounded-xl mb-3">
          <h1 className="text-3xl  mb-5 font-semibold">Skills</h1>{" "}
          {returnSkills(
            profile.experience !== undefined ? profile.skills.length : 0
          )}
        </div>
        <div className="bg-white p-4 min-h-[150px] rounded-xl mb-3">
          <h1 className="text-3xl  mb-5 font-semibold">Education</h1>{" "}
          {returnEdu(
            profile.experience !== undefined ? profile.education.length : 0
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDescr;

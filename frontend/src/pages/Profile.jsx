import { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("accounts/profile/");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-container container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-info">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Name:</strong> {profile.profile.first_name} {profile.profile.last_name}</p>
            <p><strong>Phone:</strong> {profile.profile.phone_number || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
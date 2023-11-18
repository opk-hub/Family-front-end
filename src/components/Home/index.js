
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './index.css'; 
const Home = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get('https://family-backend-api.onrender.com/family/all-members');
        setFamilyMembers(response.data);
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await axios.get('https://family-backend-api.onrender.com/eachMember/all-members');
        setProfiles(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchFamilyMembers();
    fetchProfiles();
  }, []);

  // Function to find matching data
  const findMatchingData = (member, profile) => {
    return member.members.includes(profile._id);
  };

  // Array to store matching data
  const matchingData = [];

  // Loop through both arrays and find matching data
  familyMembers.forEach((member) => {
    profiles.forEach((profile) => {
      if (findMatchingData(member, profile)) {
        matchingData.push({ member, profile });
      }
    });
  });

 

  return (
    <div className="home-container">
        <h1 className="home-title">Member Details</h1>
        {matchingData.map(({ member, profile }) => (
          <div key={profile._id} className="member-card">
            <div className='sub-card'>
              <img src={`https://family-backend-api.onrender.com/${profile.profilePicture}`} alt="Profile" className="member-image" />
              <p className="member-info">Name: {member.name}</p>
              <p className="member-info">Blood Group: {profile.bloodGroup}</p>
              <p className="member-info">Profession: {profile.profession}</p>
              <p className="member-info">Mobile Number: {profile.phone}</p>
              <p className="member-info">Current Adress: {profile.currentAddress}</p>
            
            </div>
          </div>

        ))}
    </div>
  );
};

export default Home;

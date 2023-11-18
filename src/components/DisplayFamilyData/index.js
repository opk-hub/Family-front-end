
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'; 
const DisplayFamilyData = () => {
  const [familyData, setFamilyData] = useState([]);
  const [registerData, setRegisterData] = useState([]);

  const separateDataByFamilyIds = (rData, fData) => {
    const separatedData = {};

    rData.forEach((registerMember) => {
      const familyArryInRegister = registerMember.familyIds;

      // Filter family data based on familyArryInRegister
      const familyMembers = fData.filter((familyMember) =>
        familyArryInRegister.includes(familyMember._id)
      );

      // If there are family members, add them to the separatedData
      if (familyMembers.length > 0) {
        separatedData[registerMember._id] = {
          name: registerMember.name,
          familyMembers: familyMembers,
        };
      }
    });

    return separatedData;
  };

  useEffect(() => {
    axios.get(`https://family-backend-api.onrender.com/users/all-users`)
      .then((response) => {
        setRegisterData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching family data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`https://family-backend-api.onrender.com/family/all-members`)
      .then((response) => {
        setFamilyData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching family data:', error);
      });
  }, []);

  const separatedData = separateDataByFamilyIds(registerData, familyData);



  return (
    <div className='display-container'>
      {Object.keys(separatedData).map((regId) => (
        <div key={regId} className="family-section">
          <h2 className="family-title">Register Member Name:<span className='d-name'>{separatedData[regId].name}</span> </h2>
          <ul className="family-list">
            {separatedData[regId].familyMembers.map((member) => (
              <li key={member._id} className="family-member">
            {/* <img src={`http://localhost:5000/${member._id}`} alt="Profile" className="member-image" /> */}

                <p className="field-label">Member Name: <span className='d-mem'>{member.name}</span> </p>
                <p className="field-label">Relation: <span className='d-mem'>{member.relationship}</span> </p>
                {/* Add more fields as needed */}
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
};

export default DisplayFamilyData;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './index.css'; 

const UpdateDetails = () => {
  const [familyData, setFamilyData] = useState([]);
  const registerId = Cookies.get('registerId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://family-backend-api.onrender.com/family/${registerId}`);
        setFamilyData(response.data.familyData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [registerId]);


  return (
    <div className="update-details-container">
      {familyData.length > 0 && (
        <div className='update-details-card'>
          <h2 className="update-details-heading">Update Family Data</h2>
          <ul className="update-details-list">
            {familyData.map((family) => (
              <li key={family._id} className="update-details-list-item">
                <div className="name-relationship-container">
                  <div className="name">{family.name}  </div>
                  <div className="relationship">{family.relationship}</div>
                </div>
                <Link to={`/update-member/${family.members}`} className="update-details-link">
                  <button className="update-details-button">Update </button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UpdateDetails;
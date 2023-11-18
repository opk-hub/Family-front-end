import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import './index.css'; // Import the CSS file
// import { useFamilyId } from '../FamilyIdContext';
import LoadingSpinner from '../LoadingSpinner';

const PersonInfo = () => {
  // const { familyId } = useFamilyId();
  const { familyId } = useParams()

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state


  const [formData, setFormData] = useState({
    profilePicture: null,
    phone: '',
    email: '',
    profession: '',
    bloodGroup: '',
    currentAddress: '',
    presentAddress: '',
    dateOfBirth: '',
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [memberId, setMemberId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.profilePicture || !formData.dateOfBirth || !formData.phone) {
      // Show an alert message to the user
      alert("Please select a Profile Picture and Enter a Valid Phone and Enter a ValidDate of Birth.");
      return;
    }
    setLoading(true); // Start loading

    // Create a FormData object to send the data to the server
    const dataToSend = new FormData();
    dataToSend.append('profilePicture', formData.profilePicture);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('email', formData.email);
    dataToSend.append('profession', formData.profession);
    dataToSend.append('bloodGroup', formData.bloodGroup);
    dataToSend.append('currentAddress', formData.currentAddress);
    dataToSend.append('presentAddress', formData.presentAddress);
    dataToSend.append('dateOfBirth', formData.dateOfBirth);
    dataToSend.append('familyId', familyId); 

    try {
      const response = await axios.post(`https://family-backend-api.onrender.com/eachMember/${familyId}`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for FormData
        },
      });
     

      // Handle the response if needed
      console.log('Data posted to the server:', response.data.member._id);
      const memberId=response.data.member._id

      if (response.status === 201) {
        const data = response.data;
        console.log('Member added:', data);
      } else if (response.status === 404) {
        console.error('Family not found');
      } else {
        console.error('Internal server error');
      }

      // Store the submitted data for display
      setSubmittedData(formData);
      setMemberId(memberId);

      // Switch to display mode
      setEditMode(true);
      setLoading(false); 

      
    } catch (error) {
      console.error('Error posting data to the server:', error);
      setLoading(false); 

    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file.name);

    setFormData({
      ...formData,
      profilePicture: file,
    });
  };

  const handleEditClick = () => {
     setFormData({
    profilePicture: submittedData?.profilePicture || null,
    phone: submittedData?.phone || '',
    email: submittedData?.email || '',
    profession: submittedData?.profession || '',
    bloodGroup: submittedData?.bloodGroup || '',
    currentAddress: submittedData?.currentAddress || '',
    presentAddress: submittedData?.presentAddress || '',
    dateOfBirth: submittedData?.dateOfBirth || '',
  });
  
    setEditMode(true);
    const url = `/update-member/${memberId}`;
    navigate(url);
  };

  const handleHomeClick = () => {
    navigate('/home')
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  return (
    <div className={`person-info-container ${loading ? 'loading' : ''}`}>
       {loading ? (
        <LoadingSpinner size={50} /> 
      ) : (
        <>
      {editMode ? (
        <div className="submitted-data-section">
        <h2>Submitted Data</h2>
        {submittedData.profilePicture ? (
          <p className="color-paragraph">
            Profile Picture: <img src={URL.createObjectURL(submittedData.profilePicture)} alt="Profile" className="profile-picture" />
          </p>
        ) : (
          <p>Profile Picture: No file</p>
        )}
        <p> <span className="color-paragraph">Phone:</span> {submittedData.phone}</p>
        <p> <span className="color-paragraph">Email:</span>{submittedData.email}</p>
        <p> <span className="color-paragraph">Date of Birth :</span>{submittedData.dateOfBirth}</p>

        <p> <span className="color-paragraph">Profession:</span> {submittedData.profession}</p>
        <p> <span className="color-paragraph">Blood Group:</span> {submittedData.bloodGroup}</p>
        <p> <span className="color-paragraph">Current Address:</span> {submittedData.currentAddress}</p>
        <p> <span className="color-paragraph">Present Address :</span>{submittedData.presentAddress}</p>
        <div className='button-container'>
        
        <button className="home-button" onClick={handleBackClick}>
          Back
        </button>
        <button className="edit-button" onClick={handleEditClick}>
          Edit
        </button>
        <button className="home-button" onClick={handleHomeClick}>
          Home
        </button>
        </div>
      </div>
      ) : (
        <div className="form-section">
          <h2>Enter Your Personal Details</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Profile Picture:</label>
              <input type="file" name="profilePicture" onChange={handleFileChange} className="file-input" />
            </div>
            <div>
              <label>Phone:</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="text-input" />
            </div>
            <div>
              <label>Email:</label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} className="text-input" />
            </div>
            <div>
              <label>Profession:</label>
              <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="text-input" />
            </div>
            <div>
              <label>Date of Birth:</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="text-input" />
            </div>
            <div>
              <label>Blood Group:</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="text-input" />
            </div>
            <div>
              <label>Current Address:</label>
              <input type="text" name="currentAddress" value={formData.currentAddress} onChange={handleChange} className="text-input" />
            </div>
            <div>
              <label>Present Address:</label>
              <input type="text" name="presentAddress" value={formData.presentAddress} onChange={handleChange} className="text-input" />
            </div>
            <button type="submit" className="save-button">
              Save
            </button>
          </form>

        </div>
      )}
      </>
      )}
    </div>
      

  );
};

export default PersonInfo;

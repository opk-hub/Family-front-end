import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner'; // Import your spinner component
import './index.css'

const UpdateMember = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [memberData, setMemberData] = useState({
    profilePicture: '',
    phone: '',
    profession: '',
    bloodGroup: '',
    dateOfBirth: '',
    currentAddress: '',
    nativeAddress: '',
  });
  const [loading, setLoading] = useState(true); // Add loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberData.profilePicture || !memberData.dateOfBirth) {
      // Show an alert message to the user
      alert("Please select a Profile Picture and Enter a Valid Date of Birth.");
      return;
    }

    setLoading(true); // Start loading

    const dataToSend = new FormData();
    dataToSend.append('profilePicture', memberData.profilePicture);
    dataToSend.append('phone', memberData.phone);
    dataToSend.append('profession', memberData.profession);
    dataToSend.append('bloodGroup', memberData.bloodGroup);
    dataToSend.append('dateOfBirth', memberData.dateOfBirth);
    dataToSend.append('currentAddress', memberData.currentAddress);
    dataToSend.append('nativeAddress', memberData.nativeAddress);

    try {
      const response = await axios.put(`https://family-backend-api.onrender.com/eachMember/update-members/${memberId}`, dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for FormData
        },
      });
      console.log('Member updated:', response.data);
      setEditMode(true);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error('Error updating member:', error);
      setLoading(false); // Stop loading in case of an error
    }
  };

  useEffect(() => {
    // Fetch the existing member data for pre-filling the form
    axios
      .get(`https://family-backend-api.onrender.com/eachMember/members/${memberId}`)
      .then((response) => {
        setMemberData(response.data);
        setEditMode(false);
        setLoading(false); // Stop loading once the data is fetched
      })
      .catch((error) => {
        console.error('Error fetching member data:', error);
        setLoading(false); // Stop loading in case of an error
      });
  }, [memberId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file.name);

    setMemberData({
      ...memberData,
      profilePicture: file,
    });
  };

  const handleEditClick = () => {
    navigate('/home');
  };

  return (
    <div className={`update-member-container ${loading ? 'loading' : ''}`}>
      {loading ? (
        <LoadingSpinner size={80} />
      ) : (
        <>
          {editMode ? (
            <div className="submitted-data-section">
              <h2>Submitted Data</h2>
              {memberData.profilePicture ? (
                <div>
                  <span className="color-paragraph">Profile Picture:</span>
                  <img
                    src={
                      memberData.profilePicture instanceof File
                        ? URL.createObjectURL(memberData.profilePicture)
                        : memberData.profilePicture
                    }
                    alt="Profile"
                    className="profile-picture"
                  />
                </div>
              ) : (
                <p>Profile Picture: No file</p>
              )}
              <p>
                <span className="color-paragraph">Phone:</span> {memberData.phone}
              </p>
              <p>
                <span className="color-paragraph">Email:</span>
                {memberData.email}
              </p>
              <p>
                <span className="color-paragraph">Date of Birth :</span>
                {memberData.dateOfBirth}
              </p>
              <p>
                <span className="color-paragraph">Profession:</span>
                {memberData.profession}
              </p>
              <p>
                <span className="color-paragraph">Blood Group:</span>
                {memberData.bloodGroup}
              </p>
              <p>
                <span className="color-paragraph">Current Address:</span>
                {memberData.currentAddress}
              </p>
              <p>
                <span className="color-paragraph">Native Address :</span>
                {memberData.nativeAddress}
              </p>
              <button className="edit-button" onClick={handleEditClick}>
                Home
              </button>
            </div>
          ) : (
            <div className='update-member-container'>
              <h2>Update Member</h2>
              <form onSubmit={handleSubmit} className='form-container'>
                <div>
                  <label className='form-label '>Profile Picture:</label>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleFileChange}
                    className='file-input'
                  />
                </div>
                <div>
                  <label className='form-label '>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={memberData.phone}
                    onChange={handleInputChange}
                    className='form-input'
                  />
                </div>
                <div>
                  <label className='form-label '>Profession:</label>
                  <input
                    type="text"
                    name="profession"
                    value={memberData.profession}
                    onChange={handleInputChange}
                    className='form-input'

                  />
                </div>
                <div>
                  <label className='form-label '>Blood Group:</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={memberData.bloodGroup}
                    onChange={handleInputChange}
                    className='form-input'

                  />
                </div>
                <div>
                  <label className='form-label '>Date of Birth:</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={memberData.dateOfBirth}
                    onChange={handleInputChange}
                    className='form-input'


                  />
                </div >
                <div>
                  <label className='form-label '>Current Address:</label>
                  <input
                    type="text"
                    name="currentAddress"
                    value={memberData.currentAddress}
                    onChange={handleInputChange}
                    className='form-input'

                  />
                </div>
                <div className='form-label '>
                  <label>Native Address:</label> <br/>
                  <input
                    type="text"
                    name="nativeAddress"
                    value={memberData.nativeAddress}
                    onChange={handleInputChange}
                    className='form-input'

                  />
                </div>
                <button className='submit-button' type="submit">Update Member</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateMember;

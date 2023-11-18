import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../../App';
// import { useFamilyId } from '../FamilyIdContext';
import './index.css'
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';


const MyProfile = () => {
    const [loading, setLoading] = useState(false);

    // const { setFamilyId } = useFamilyId();
    const { registerId } = useParams();
    const [token, setToken] = useContext(store);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    // const [storedRegisterId, setRegisterId] = useState(); // Store registerId in a separate state
    // const [registerData, setRegisterData] = useState(null);
// console.log(registerId._id)

    const [familyData, setFamilyData] = useState([]);
    const [deleteSuccess, setDeleteSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    // Retrieve registerId from cookies
    // const storedRegisterId = Cookies.get('registerId');
    
    // Use the stored registerId if available, otherwise use the one from URL params
    // const currentRegisterId = storedRegisterId || registerId;
    
    
    

    const [newMember, setNewMember] = useState({
        name: '',
        relationship: '',
        additionalInfo: '',
        registerId: registerId, 
    });

    const relationshipOptions = [
        'Father',
        'Mother',
        'Husband',
        'Wife',
        'Son',
        'First Son',
        'Second Son',
        'Third Son',
        'Daughter',
        'First Daughter',
        'Second Daughter',
        'Third Daughter',
    ];

    const addMember = () => {
        if (newMember.name.trim() === '' || newMember.relationship.trim() === '') {
            alert('Name and Relationship are required fields.');
            return;
        }
        setLoading(true);
        axios
            .post('https://family-backend-api.onrender.com/family/create-member', newMember, {
                headers: {
                    'x-token': token,
                },
            })
            .then((response) => {
                console.log('Data saved successfully:', response.data);
                // const familyId = response.data.familyMember._id;
                // setFamilyId(familyId);
                
                setLoading(false);
                const updatedFamilyData = [...familyData, response.data];
                console.log(updatedFamilyData)
                // Cookies.set('familyData', JSON.stringify(updatedFamilyData), { expires: 365 });

                setFamilyData(updatedFamilyData);

                setNewMember({
                    name: '',
                    relationship: '',
                    additionalInfo: '',
                    registerId: registerId, // Set registerId from your context
                });
                
            })
            .catch((error) => {
                console.error('An error occurred while saving data:', error);
            });
    };


    
    
    useEffect(() => {
        const storedToken = Cookies.get('token');

        if (storedToken  ) {
            setToken(storedToken);
        
        }
         else {
            navigate('/');
        }

        // const storedFamilyData = Cookies.get('familyData');
        // if (storedFamilyData) {
        //     setFamilyData(JSON.parse(storedFamilyData));
        // }

        const fetchData = async () => {
            try {
                if (!token) {
                    // Handle the case where the token is missing
                    navigate('/');
                    return;
                }else if(registerId === 'undefined'){
                    navigate(`/`);
                    Cookies.remove('token');
                    setToken(null);
        
                }

                setLoading(true);


                const response = await axios.get(`https://family-backend-api.onrender.com/users/my-profile`, {
                    headers: {
                        'x-token': token,
                    },
                });

                setLoading(false);
                // const storedRegisterId=response.data._id
                
                // setRegisterId(response.data); // Set registerId
                setData(response.data);
                //  if(registerId === 'undefined'){
                //     navigate(`/users/my-profile/${storedRegisterId}`);
                //     // Cookies.remove('token');
                //     // setToken(null);
        
                // }
                // console.log(response.data)
                console.log(response.data.familyIds)
                // setRegisterData(response.data.familyIds)
            } catch (error) {
                setLoading(false);
                if (error.response && error.response.status === 400 && error.response.data === 'User Not Found') {
                    navigate('/');
                }
                
                else {
                    console.error('An error occurred:', error);
                }
            }
        };

        fetchData();
    }, [token, navigate, setToken,registerId]);



    const removeMember = (_id, name) => {
        if (!_id) {
            console.error('Invalid or missing member ID:', _id);
            return;
        }

        axios
            .delete(`https://family-backend-api.onrender.com/family/delete-member/${_id}`, {
                headers: {
                    'x-token': token,
                },
            })
            .then(() => {
                const updatedFamilyData = familyData.filter((member) => member.familyMember._id !== _id);
                setFamilyData(updatedFamilyData);

                setDeleteSuccess(`${name} deleted successfully`);

                // Remove the associated cookie when a member is removed
                // Cookies.set('familyData', JSON.stringify(updatedFamilyData), { expires: 365 });

                // Remove the individual member's cookie
                Cookies.remove(`familyMember_${_id}`);
            })
            .catch((error) => {
                console.error('An error occurred while deleting the member:', error);
            });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // useEffect(() => {
    //     const fetchFamilyData = async () => {
    //       try {
    //         const response = await axios.get(`http://localhost:5000/family/${registerId}`); // Replace with your API URL
    //         setFamilyData(response.data.familyData);
    //         // console.log(response.data.familyData)
    //       } catch (error) {
    //         console.error('Error fetching family data:', error);
    //       }
    //     };
    
    //     fetchFamilyData();
    //   }, [registerId]);


    const moreInfo = (familyMemberId)=>{
        navigate(`/users/personinfo/${familyMemberId}`);
    }

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     console.log("Selected file:", file.name);
    
    
    //   };

    return (
        <div className="centered-content">
            <div className="user-info">
            {loading ? (
                    <LoadingSpinner />
                ) : data && (
                    <div className="user">
                        <h1 className="heading">Welcome User: <span className='dis-user-name'>{data.name}</span>  </h1><br />
                        <button className="logout-button" onClick={() => {
                            Cookies.remove('token');
                            setToken(null);
                        }}>Logout
                        </button>
                    </div>
                )}

                <div className="family-members">
                    <h2>Family Members</h2>

                    

                    {isEditing && (
                        <div className="add-member-form">
                            <input
                                type="text"
                                placeholder="Name"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            />
                            <select
                                value={newMember.relationship}
                                onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                            >
                                <option value="">Select Relationship</option>
                                {relationshipOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                           
              
                             {/* <input type="file" name="profilePicture" onChange={handleFileChange} className="file-input" /> */}
            
                            <input
                                type="text"
                                placeholder="Additional Info"
                                value={newMember.additionalInfo}
                                onChange={(e) => setNewMember({ ...newMember, additionalInfo: e.target.value })}
                            />
                            <button type="button" onClick={addMember}>
                                Add Member
                            </button>
                        </div>
                    )}
                    <ul className="member-list">
                    {familyData.map((member) => (
                            <li key={member.familyMember._id} className="family-member">
                                {member.familyMember.name} - {member.familyMember.relationship} 
                                {/* - <img src={`http://localhost:5000/${profilePicture}`} alt="Profile" className="member-image" /> */}

                                {isEditing && (
                                    <button type="button" className="action-button" onClick={() => removeMember(member.familyMember._id, member.familyMember.name)}>
                                        Remove
                                    </button>
                                )}
                        {/* {familyData.map((member) => (
                            <li key={member.familyMember._id} className="family-member">
                                {member.familyMember.name} - {member.familyMember.relationship}
                                {isEditing && (
                                    <button type="button" className="action-button" onClick={() => removeMember(member.familyMember._id, member.familyMember.name)}>
                                        Remove
                                    </button>
                                )} */}
                                {!isEditing && (
                                    <button
                                        type="button"
                                        className="action-button"
                                        onClick={() => moreInfo(member.familyMember._id)}>
                                        More Info
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {isEditing ? (
                        <button type="button" className="edit-save-button" onClick={toggleEdit}>
                            Save
                        </button>
                    ) : (
                        <button type="button" className="edit-save-button" onClick={toggleEdit}>
                            Enter Your Details
                        </button>
                    )}
                    {deleteSuccess && <div className="success-message">{deleteSuccess}</div>}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

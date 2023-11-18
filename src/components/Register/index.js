import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { useRegisterId } from '../RegisterIdContext';
import './index.css'


const Register = () => {
  const navigate = useNavigate();
  const { setRegisterId } = useRegisterId();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }

    try {

      const response = await axios.post('https://family-backend-api.onrender.com/users/register', formData);
      console.log(response.data)
      const registerId = response.data.register._id;
      console.log(registerId)
      setRegisterId(registerId);

      setTimeout(() => {
        navigate(`/`, { state: response.status });
      }, 2000);


      navigate(`/`, { state: response.status });
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log('Network error:', error.message);
      }
    }
  };
  return (
    <div className="register-container">
      <div>
      <h1 className='heading-res'>Register</h1>
      
        <form className="register-form" onSubmit={handleSubmit}>
       
          <label className="register-label" htmlFor="name">
            User Name:
          </label>
          <input
            className="register-input"
            type="text"
            onChange={handleChange}
            name="name"
            placeholder="User Name"
            value={formData.name}
          />
        
          <label className="register-label" htmlFor="phone">
            Phone Number:
          </label>
          <input
            className="register-input"
            type="number"
            onChange={handleChange}
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
          />
       
          <label className="register-label" htmlFor="email">
            Email:
          </label>
          <input
            className="register-input"
            type="email"
            onChange={handleChange}
            name="email"
            placeholder="Email"
            value={formData.email}
          />
       
          <label className="register-label" htmlFor="password">
            Password:
          </label>
          <input
            className="register-input"
            type="password"
            onChange={handleChange}
            name="password"
            placeholder="Password"
            value={formData.password}
          />
        
          <label className="register-label" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            className="register-input"
            type="password"
            onChange={handleChange}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
          />
        
          <input className="register-submit-button" type="submit" value="Register" />
       
      </form>

     <p className="signup-link">
        Already have an account ? 
        <Link  to='/'>Login here</Link>

      </p>


    </div>
    </div>
  );
};

export default Register;


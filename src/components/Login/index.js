import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { store } from '../../App';
import { useNavigate,Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoadingSpinner from '../LoadingSpinner';


import './index.css';

const Login = () => {
    const [loading, setLoading] = useState(false);

    const [registerId, setRegisterId] = useState(); // Store registerId in a separate state
    console.log(registerId)
    const [token, setToken] = useContext(store);
    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const changeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = e => {
        e.preventDefault();
        setLoading(true); // Start loading

        axios.post('https://family-backend-api.onrender.com/users/login', data)
            .then(res => {
                const token = res.data.token;
                console.log(res.data)
                const registerId=res.data.registerId
                setRegisterId(registerId)
                Cookies.set('registerId', registerId, { expires: 365 });


                // Store the token in a cookie
                Cookies.set('token', token, { expires: 365 });
                setToken(token);
                setTimeout(() => {
                    setLoading(false);
                    navigate(`/users/my-profile/${registerId}`);
                  }, 2000);
                })
                .catch((error) => {
                  setLoading(false);
                  setError('Email and Password are not matching');
                });
            };
          

    useEffect(() => {
        if (token) {
            navigate(`/users/my-profile/${registerId}`);
        }
    }, [token, navigate,registerId]);

    return (
        <div className="centered-form">

            <form onSubmit={submitHandler} className="form-container-log">

                <h3 className='login'>LOGIN</h3>
                <input type="email" onChange={changeHandler} name="email" placeholder="Email" className="form-input-log" />
                <input type="password" onChange={changeHandler} name="password" placeholder="Password" className="form-input-log" />
                <input type="submit" value="Login" className="login-button" />
            </form>
            {loading ? (
        <LoadingSpinner /> // Display loading spinner when loading is true
      ) : null}
            {error && <p className="error-message">{error}</p>}

            <p className="signup-link">
                Don't have an account ? 
                <Link  to='/users/register'><span className='signup'>Register  here</span></Link>

            </p>
        </div>
    );
}

export default Login;

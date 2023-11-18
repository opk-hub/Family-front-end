import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { store } from '../../App';
import './index.css';

const Navbar = () => {
    const [token, setToken] = useContext(store);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('registerId');
        setToken(null);
        navigate('/');
    };

    return (
        <div>
            <div className="navbar-container">
                {token && (
                    <ul className="navbar-list">
                        <li className="navbar-list-item">
                            <Link className="navbar-link" to='/home'>Home</Link>
                        </li>
                        <li className="navbar-list-item">
                            <Link className="navbar-link" to='/display-register-family'>Display Register Families</Link>
                        </li>
                        <li className="navbar-list-item">
                            <Link className="navbar-link" to='/family'>Family Info</Link>
                        </li>
                        
                        <li className="navbar-list-item">
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Navbar;

import './Register.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            try {
            
                // Make a POST request to the registration endpoint
                const response = await fetch('http://localhost:5000/api/Users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'text/plain'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        displayName: displayName,
                    })
                });

                if (response.status === 200) {
                    navigate('/'); // Redirect to the home page or desired route
                } else {
                    //navigate('/');
                    alert('Username you chose already exist!');
                }
            } catch (error) {
                console.error('Registration failed:', error);
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
         
            switch (name) {
                case 'username':
                    setUsername(value);
                    break;
                case 'password':
                    setPassword(value);
                    break;
                case 'confirmPassword':
                    setConfirmPassword(value);
                    break;
                case 'displayName':
                    setDisplayName(value);
                    break;
                default:
                    break;
            
        }
    };
    const saveDataToLocalStorage = () => {
        // const { username, password, displayName, profilePicture } = this.state;
        const data = { username, password, displayName };
        // check if the username already exists in localStorage
        const existingData = JSON.parse(localStorage.getItem(username));
        /*if (existingData) {
            alert(`user with name ${username} already exists!`);
            return false;

        } else {*/
            localStorage.setItem(username, JSON.stringify(data));
            return true;
        //}
        //localStorage.setItem('formData', JSON.stringify(data));
    };

    const validateForm = () => {

        // const { password, confirmPassword, profilePicture } = state;
        /*const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // regex for password validation
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return false;
        }
        if (!passwordRegex.test(password)) {
            alert('Password must be at least 8 characters long and contain at least one letter and one number');
            return false;
        }*/
        return true;

    };

    return (

        <div>
            <div className="background-shape"></div>
            <div className="reg-container">
                <h1>
                    Welcome!
                    <br />
                    Please register
                </h1>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" required value={username} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div class="password-help">
                            <img class="help-icon" src="help.png" alt="Password requirements" />
                            <div class="help-text">
                                Password must be at least 8 characters long and contain at least one letter and one number.
                            </div>
                        </div>
                        <input type="password" id="password" name="password" required value={password} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <div class="password-help">
                            <img class="help-icon" src="help.png" alt="Password requirements" />
                            <div class="help-text">
                                Password must be at least 8 characters long and contain at least one letter and one number.
                            </div>
                        </div>

                        <input type="password" id="confirm-password" name="confirmPassword" required value={confirmPassword} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="display-name">Display Name</label>
                        <input type="text" id="display-name" name="displayName" required value={displayName} onChange={handleChange} />
                    </div>
                    <button type="submit">Submit</button>
                </form>
                <div className="login-link">
                    <p>Already registered? <Link to="/">Click here</Link> to log in</p>
                </div>
                <div className="left-bottom">


                    <img src="/logo.png" alt="logo" width="100" height="75" style={{ marginRight: '2px', borderRadius: '0%' }} />
                </div>
            </div>
        </div>

    );
}

export default Register;
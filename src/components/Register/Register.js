import './Register.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {

        // Make a POST request to the registration endpoint
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'text/plain'
          },
          body: JSON.stringify({
            username: username,
            password: password,
          })
        });

        if (response.ok) {
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
      default:
        break;

    }
  };
  const saveDataToLocalStorage = () => {
    // const { username, password, displayName, profilePicture } = this.state;
    const data = { username, password };
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
    <motion.div
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{
        duration: 10,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      className='background-animate-register'
    >
      <div>
        <div className="reg-container">
          <h1>
            Welcome!
            <br />
            Please register
          </h1>
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <input type="text"
                id="username"
                name="username"
                className='input-bar'
                required value={username}
                onChange={handleChange}
                placeholder='Username' />
            </div>

            <div className="form-group">
              {/* <div class="password-help">
                <img class="help-icon" src="help.png" alt="Password requirements" />
                <div class="help-text">
                  Password must be at least 8 characters long and contain at least one letter and one number.
                </div>
              </div> */}
              <input
                type="password"
                id="password"
                name="password"
                className='input-bar'
                required value={password}
                onChange={handleChange}
                placeholder='Password'
              />
            </div>

            <div className="form-group">
              {/* <div class="password-help">
                <img class="help-icon" src="help.png" alt="Password requirements" />
                <div class="help-text">
                  Password must be at least 8 characters long and contain at least one letter and one number.
                </div>
              </div> */}

              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                className='input-bar'
                required value={confirmPassword}
                onChange={handleChange}
                placeholder='Confirm Password'
              />
            </div>

            <motion.div whileHover={{ scale: 1.10 }}>
              <button type="submit" className='register-btn '>
                Submit
              </button>
            </motion.div>
          </form>
          <div className="login-link">
            <p>Already registered? <Link to="/">Click here</Link> to log in</p>
          </div>
          <div className="left-bottom">


            <img src="/logo.png" alt="logo" width="100" height="75" style={{ marginRight: '2px', borderRadius: '0%' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Register;
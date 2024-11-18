import './Register.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactComponent as InfoIcon } from '../../info-circle-svgrepo-com.svg'

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
      className='register-background'
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}>

        <motion.div
          className='register-container'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
            
            
            <motion.h1
              className='register-h1'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}>
                Welcome!<br />Please Register
            </motion.h1>

            <motion.form
              className='register-form'
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.div className='register-input-container'>
                  <motion.input
                    className="register-input-bar"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.05, borderColor: "#0096d6" }}
                    transition={{ duration: 0.3 }}
                    required />
                </motion.div>

                

                <motion.div className='register-input-container'>
                  <motion.input
                    className="register-input-bar"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    whileFocus={{ scale: 1.05, borderColor: "#0096d6" }}
                    transition={{ duration: 0.3 }}
                    required />

                  <motion.div className='register-icon-container'>
                    <InfoIcon className='register-info-ico'/>
                    <motion.div className='register-popover'>
                      Password must be at least 8 characters long and contain at least one letter and one number.
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div className='register-input-container'>
                  <motion.input
                    className='register-input-bar'
                    type='password'
                    name="confirmPassword"
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={handleChange} />

                  <motion.div className='register-icon-container'>
                    <InfoIcon className='register-info-ico'/>
                    <motion.div className='register-popover'>
                      Password must be at least 8 characters long and contain at least one letter and one number.
                    </motion.div>
                  </motion.div>
                </motion.div>
                

                <motion.button
                  className="register-btn"
                  type="submit"
                  whileHover={{ scale: 1.05, backgroundColor: "#007bb5" }}
                  whileTap={{ scale: 0.95 }}>
                    Register
                  </motion.button>

              </motion.form>

              <motion.p className='login-link'>
                Already registered? <Link to='/'>Click here</Link> to login
              </motion.p>

        </motion.div>
      
    </motion.div>
  );
}

export default Register;
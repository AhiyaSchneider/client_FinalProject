import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem(username, token);
        //navigate(`/upload`);
        navigate(`/api/upload?username=${username}`);
      } else {
        //navigate(`/upload`);
        setError("Invalid credentials, please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
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
      className='background-animate'
    >
      <motion.div
        id='motion-container-outer'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='motion-container'
      >
        <div className="login-container">
          <h1 >
            Welcome!
            <br />
            Please log in to start scheduling
          </h1>
          <form onSubmit={handleLogin}>
            <div className="form-control">
              <input
                type="text"
                id="username"
                name="username"
                className="input-bar"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="form-control">
              <input
                type="password"
                id="password"
                name="password"
                className="input-bar"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
              />
            </div>
            {error && <div className="error">{error}</div>}
            <motion.div whileHover={{ scale: 1.10 }}>
              <button type="submit" className="login-btn">
                Login
              </button>
            </motion.div>
          </form>
          <div className="login-link">
            <p>
              Not registered yet? <Link to="/register">Click here</Link> to
              register
            </p>
          </div>
        </div>
        {/* <div className="left-bottom">
          <img src="/logo.png" alt="logo" width="100" height="75" style={{ marginRight: '2px', borderRadius: '0%' }} />
        </div> */}
      </motion.div>
    </motion.div>
  );
}

export default Login;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { useNavigate } from 'react-router-dom';

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
    <>
      <div className="background-shape"></div>
      <div className="log-container">
        <h1>
          Welcome!
          <br />
          Please log in to start scheduling
        </h1>
        <form onSubmit={handleLogin}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div className="login-link">
          <p>
            Not registered yet? <Link to="/register">Click here</Link> to
            register
          </p>
        </div>
      </div>
      <div className="left-bottom">
        <img src="/logo.png" alt="logo" width="100" height="75" style={{ marginRight: '2px', borderRadius: '0%' }} />
      </div>
    </>
  );
}

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
                    accept: "*/*",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json(); // Assuming the server sends a JSON response
                const token = data.token; // Extract the token from the JSON response
                console.log("token: ", token);
                console.log("data, ", data);

                if (token) {
                    localStorage.setItem(`${username}`, token);
                    navigate(`/api/upload?username=${username}`); // Navigate to the upload page
                } else {
                    setError("Failed to retrieve token. Please try again.");
                }
            } else {
                setError("Invalid credentials, please try again.");
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <motion.div
            className="login-background"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 10, ease: "easeInOut" }}>
            
            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}>
            
                <motion.h1
                    className="login-h1"
                    initial={{ opacity: 0, scale: 0.8}}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}>
                        Login
                </motion.h1>

                <motion.form 
                    className="login-form"
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}>
                    
                    <motion.input
                        className="login-input-bar"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        whileFocus={{ scale: 1.05, borderColor: "#0096d6" }}
                        transition={{ duration: 0.3 }}
                        required />
                    
                    <motion.input
                        className="login-input-bar"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        whileFocus={{ scale: 1.05, borderColor: "#0096d6" }}
                        transition={{ duration: 0.3 }}
                        required />

                    {error && <motion.div className="error">{error}</motion.div>}

                    <motion.button
                        className="login-btn"
                        type="submit"
                        whileHover={{ scale: 1.05, backgroundColor: "#007bb5" }}
                        whileTap={{ scale: 0.95 }}>
                            Login
                    </motion.button>
                </motion.form>

                <motion.p className="login-link">
                    Not registered yet? <Link to="/register">Click here</Link> to register
                </motion.p>
            </motion.div>
        </motion.div>
    );
}

export default Login;




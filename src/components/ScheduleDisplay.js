import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Typography, Menu, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ScheduleDisplay = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract schedule and username from location.state
    const [schedule, setSchedule] = useState(location.state?.schedule || []);
    const [username, setUsername] = useState(location.state?.username || "");

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState('');

    const requiredHeaders = {
        demandFile: ['Date', 'Time Interval', 'Worker Type', 'Demand'],
        costFile: ['Worker ID', 'Worker Name', 'Skill', 'Hourly Cost', 'Available From', 'Available Until'],
        workersFile: ['Worker ID', 'Worker Name', 'Skill', 'Available From', 'Available Until']
    };

    // Function to handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Function to handle opening the menu
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to handle closing the menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Function to set file type and close the menu
    const setFileTypeAndClose = (type) => {
        setFileType(type);
        handleMenuClose();
    };

    // Function to handle file upload with validation and token
    const handleFileUpload = async () => {
        if (!selectedFile || !fileType) {
            alert('Please select a file and determine the file type before uploading.');
            return;
        }

        const expectedHeaders = requiredHeaders[fileType];
        if (!expectedHeaders) {
            alert('Invalid file type selected.');
            return;
        }

        // Validate the file structure
        try {
            await validateFileStructure(selectedFile, expectedHeaders);
            setError('');

            // If the file structure is valid, proceed with the upload
            const formData = new FormData();
            formData.append(fileType, selectedFile);

            // Get the token from localStorage
            const token = localStorage.getItem(username);
            if (!token) {
                alert('Authorization token is missing. Please log in again.');
                return;
            }
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

                if (decodedToken.exp < currentTime) {
                    // Token has expired
                    alert("Session expired. Please log in again.");
                    navigate('/');
                    return;
                }
            } catch (err) {
                console.error("Error decoding token:", err);
                alert("Invalid token. Please log in again.");
                navigate('/');
                return;
            }

            // Make the POST request to the server
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` // Add the token to the Authorization header
                }
            });

            // Handle the response
            if (response.data.schedule) {
                setSchedule(response.data.schedule); // Update the schedule state with the new data
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "An unexpected error occurred.");
        }
    };

    // Function to validate file structure
    const validateFileStructure = (file, expectedHeaders) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(header => header.trim());

                const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
                if (missingHeaders.length > 0) {
                    const errorMessage = `The file is missing the following columns: ${missingHeaders.join(', ')}`;
                    setError(errorMessage);
                    reject(errorMessage);
                } else {
                    setError('');
                    resolve();
                }
            };
            reader.onerror = () => reject('Error reading the file.');
            reader.readAsText(file);
        });
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
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(-45deg, #FF5733, #C70039, #900C3F, #581845)',
                backgroundSize: '400% 400%',
                zIndex: -1,
            }}
        >
            <Container style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
                <Typography variant="h4" gutterBottom>Schedule Overview</Typography>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Date</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Start Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>End Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Skill</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Workers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((shift, idx) => (
                            <React.Fragment key={idx}>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.date}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.startTime}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.endTime}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.skill}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>
                                        {shift.workers.map(worker => worker.workerName || worker.workerId).join(', ')}
                                    </td>
                                </tr>
                                {shift.message && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '8px', color: '#FFD700', fontSize: '0.9rem', textAlign: 'left' }}>
                                            <em>Note: {shift.message}</em>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {/* Container for the buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload-input"
                    />
                    <label htmlFor="file-upload-input">
                        <Button variant="contained" color="primary" component="span">
                            Choose File
                        </Button>
                    </label>

                    {/* Button to open the menu for choosing file type */}
                    <Button variant="contained" color="info" onClick={handleMenuClick}>
                        Select File Type
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => setFileTypeAndClose('demandFile')}>Demand File</MenuItem>
                        <MenuItem onClick={() => setFileTypeAndClose('costFile')}>Workers Cost File</MenuItem>
                        <MenuItem onClick={() => setFileTypeAndClose('workersFile')}>Workers List File</MenuItem>
                    </Menu>

                    {/* Button to upload the file */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleFileUpload}
                    >
                        Upload File
                    </Button>
                </div>

                {/* Return Button */}
                <Button
                    variant="contained"
                    color="default"
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '20px' }}
                >
                    Return
                </Button>
            </Container>
        </motion.div>
    );
};

export default ScheduleDisplay;

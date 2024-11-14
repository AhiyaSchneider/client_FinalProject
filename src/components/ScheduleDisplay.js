import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Typography, Menu, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ScheduleDisplay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //const schedule = location.state?.schedule || [];

    const [schedule, setSchedule] = useState([]);
    // Initialize the schedule with data from location.state
    useEffect(() => {
        if (location.state?.schedule) {
            setSchedule(location.state.schedule);
        }
    }, [location.state]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState(''); // State to hold the file type
    const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor
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
            console.log("File selected:", file.name);
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
        console.log("File type set as:", type);
        handleMenuClose();
    };

    // Function to handle file upload with validation
    const handleFileUpload = async () => {
        if (!selectedFile || !fileType) {
            alert('Please select a file and determine the file type before uploading.');
            return;
        }

        // Define the expected headers based on the chosen file type
        const expectedHeaders = requiredHeaders[fileType];
        if (!expectedHeaders) {
            console.log("file type:", fileType);
            alert('Invalid file type selected.');
            return;
        }

        // Validate the file structure
        try {
            await validateFileStructure(selectedFile, expectedHeaders);
            setError(''); // Clear any previous errors

            // If the file structure is valid, proceed with the upload
            const formData = new FormData();
            formData.append(fileType, selectedFile);

            // Make the POST request to the server
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Handle the response
            console.log('File uploaded successfully:', response.data);
            if (response.data.schedule) {
                setSchedule(response.data.schedule); // Update the schedule state with the new data
            }
        } catch (error) {
            console.error('Validation error:', error);
            setError(error); // Display the error message
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

                // Check for missing headers
                const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
                if (missingHeaders.length > 0) {
                    const errorMessage = `The file is missing the following columns: ${missingHeaders.join(', ')}`
                    alert("the file isn't matching");
                    setError(errorMessage); // Set the error state to notify the user
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

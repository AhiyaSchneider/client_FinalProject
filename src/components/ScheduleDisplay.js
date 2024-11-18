import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography, Menu, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ScheduleDisplay.css'

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
    const [expandedRow, setExpandedRow] = useState(null);
    const [workerFilter, setWorkerFilter] = useState("");

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

    const toggleRow = (idx) => {
        setExpandedRow((prev) => (prev === idx ? null : idx));
    };

    const filteredSchedule = schedule.filter((shift) =>
        shift.workers.some((worker) =>
        (worker.workerName || worker.workerId)
            .toLowerCase()
            .includes(workerFilter.toLowerCase())
        )
    );

    return (
        <motion.div
            className='schedule-container'
            initial={{ backgroundPosition: '0% 50%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}>
                <Typography variant="h4" gutterBottom>Schedule Overview</Typography>
                <motion.div className='filter-container'>
                    <motion.label htmlFor='worker-filter' className='filter-label'>
                        Filter by worker
                    </motion.label>
                    <motion.input
                        id='worker-filter'
                        className='filter-input'
                        name='workerFilter'
                        type='text'
                        value={workerFilter}
                        onChange={(e) => setWorkerFilter(e.target.value)}
                        placeholder='Enter Worker Name'>

                    </motion.input>
                </motion.div>
                <motion.table className="schedule-table">
                    <motion.thead>
                        <motion.tr>
                            <motion.th>Date</motion.th>
                            <motion.th>Start Time</motion.th>
                            <motion.th>End Time</motion.th>
                            <motion.th>Skill</motion.th>
                            <motion.th>Workers</motion.th>
                        </motion.tr>
                    </motion.thead>

                    <motion.tbody>
                        {filteredSchedule.map((shift, idx) => (
                            <React.Fragment key={idx}>
                                {/* Main shift row */}
                                <motion.tr
                                    className={`shift-row ${shift.message ? 'has-warning' : ''}`}
                                    onClick={() => toggleRow(idx)}>
                                        <motion.td>{shift.date}</motion.td>
                                        <motion.td>{shift.startTime}</motion.td>
                                        <motion.td>{shift.endTime}</motion.td>
                                        <motion.td>{shift.skill}</motion.td>
                                    <motion.td>{shift.workers.map(worker => worker.workerName || worker.workerId).join(', ')}</motion.td>
                                </motion.tr>
                                {/* Message row (conditionally rendered) */}
                                {expandedRow === idx && shift.message && (
                                    <motion.tr 
                                        className='message-row'
                                        initial ={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.6 }}>
                                            <motion.td colSpan="5">
                                                <em>{shift.message}</em>
                                            </motion.td>
                                    </motion.tr>
                                )}
                            </React.Fragment>
                        ))}
                    </motion.tbody>
                </motion.table>

                {/* Container for the buttons */}
                <motion.div className='sch-prime-btn-container'>
                    <motion.div className='sch-choose-file-btn'>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="file-upload-input"
                        />
                        <label htmlFor="file-upload-input">
                            <motion.div className='sch-hover-effect' whileHover={{ scale: 1.10}}>
                                <Button variant="contained" color="primary" component="span">
                                    Choose File
                                </Button>
                            </motion.div>
                        </label>
                    </motion.div>

                    {/* Button to open the menu for choosing file type */}
                    <motion.div className='sch-file-type-btn'>
                        <motion.div className='sch-hover-effect' whileHover={{scale: 1.10}}>
                            <Button variant="contained" color="info" onClick={handleMenuClick}>
                                Select File Type
                            </Button>
                        </motion.div>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}>
                            <MenuItem onClick={() => setFileTypeAndClose('demandFile')}>Demand File</MenuItem>
                            <MenuItem onClick={() => setFileTypeAndClose('costFile')}>Workers Cost File</MenuItem>
                            <MenuItem onClick={() => setFileTypeAndClose('workersFile')}>Workers List File</MenuItem>
                        </Menu>
                    </motion.div>

                    {/* Button to upload the file */}
                    <motion.div className='sch-hover-effect' whileHover={{scale: 1.10}}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleFileUpload}>
                            Upload File
                        </Button>
                    </motion.div>
                    
                </motion.div>

                {/* Return Button */}
                <motion.div className='sch-hover-effect' whileHover={{scale: 1.10}}>
                    <Button
                        variant="contained"
                        color="default"
                        onClick={() => navigate(-1)}
                        style={{ marginTop: '20px' }}>
                        Return
                    </Button>
                </motion.div>
                
        </motion.div>
    );
};

export default ScheduleDisplay;

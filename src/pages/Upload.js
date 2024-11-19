import React, { useState } from 'react';
import { Typography, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Upload.css';
import { jwtDecode } from 'jwt-decode';



function Upload({ onScheduleUpdate }) {
  const [demandFile, setDemandFile] = useState(null);
  const [costFile, setCostFile] = useState(null);
  const [workersFile, setWorkersFile] = useState(null);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract username from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username'); // Extracts 'username' from URL


  const requiredHeaders = {
    demandFile: ['Date', 'Time Interval', 'Worker Type', 'Demand'],
    costFile: ['Worker ID', 'Worker Name', 'Skill', 'Hourly Cost', 'Available From', 'Available Until'],
    workersFile: ['Worker ID', 'Worker Name', 'Skill', 'Available From', 'Available Until']
  };

  const handleFileChange = (setter) => (event) => {
    const file = event.target.files[0];
    if (file && !file.name.endsWith('.csv')) {
      setError(`Please upload a CSV file.`);
      setter(null);
    } else {
      setError('');
      // Set the selected file
      setter(file);
  
      // Increment selected files count if it's a new selection
      setSelectedFilesCount((prevCount) => {
        const newCount = prevCount + 1;
        setUploadProgress((newCount / 3) * 100); // Update progress for 3 files
        return newCount;
      });
    }
  }

  const validateFileStructure = (file, expectedHeaders, fileName) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());

        const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
          reject(`The ${fileName} file is missing the following columns: ${missingHeaders.join(', ')}`);
        } else {
          resolve();
        }
      };
      reader.onerror = () => reject(`Error reading ${fileName} file.`);
      reader.readAsText(file);
    });
  };

    const handleUpload = async () => {
        if (!demandFile || !costFile || !workersFile) {
            setError('Please select all three files to upload.');
            return;
        }

        try {
            await Promise.all([
                validateFileStructure(demandFile, requiredHeaders.demandFile, 'Demand Data'),
                validateFileStructure(costFile, requiredHeaders.costFile, 'Cost Data'),
                validateFileStructure(workersFile, requiredHeaders.workersFile, 'Workers List')
            ]);

            setUploading(true);
            setError('');

            const formData = new FormData();
            formData.append('demandFile', demandFile);
            formData.append('costFile', costFile);
            formData.append('workersFile', workersFile);
            formData.append('username', username);

            // Get the token from localStorage
            const token = localStorage.getItem(username);
            // Check if the token has expired
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
              setSelectedFilesCount(0);
              setUploadProgress(0);
                console.error("Error decoding token:", err);
                alert("Invalid token. Please log in again.");
                navigate('/');
                return;
            }

            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                },
            });

            onScheduleUpdate(res.data.schedule);
            navigate('/schedule', { state: { schedule: res.data.schedule, username } });
        } catch (error) {
            setError(error.response?.data?.message || error.message || "An unexpected error occurred.");
        } finally {
            setUploading(false);
        }
    };

  return (
    <motion.div
      className="upload-background"
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}>
      <motion.div
        className="upload-container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        
        <motion.h1 className='upload-title'>Upload Files</motion.h1>

        <motion.div className="upload-progress-container">
          <LinearProgress
            className="upload-progress-bar"
            variant="determinate"
            value={uploadProgress}/>
          <Typography
            className="upload-progress-text"
            variant="body2">
              {`${Math.round(uploadProgress)}%`}
          </Typography>
        </motion.div>

        <motion.div className='upload-input-wrapper'>
          <input 
            accept=".csv" 
            className='hidden-input' 
            id="demand-file" type="file" 
            onChange={handleFileChange(setDemandFile)} />
          <label htmlFor="demand-file">
            <motion.div className='upload-hover-effect' whileHover={{ scale: 1.10 }}>
              <Button
                variant="contained"
                color="transparent"
                component="span"
                className={`upload-file-btn ${demandFile ? 'selected' : ''}`}>
                  {demandFile ? `Selected: ${demandFile.name}` : "Choose Demand File Data"}
              </Button>
            </motion.div>
          </label>
        </motion.div>

        <motion.div className='upload-input-wrapper'>
          <input 
            accept=".csv" 
            className='hidden-input' 
            id="cost-file" 
            type="file" 
            onChange={handleFileChange(setCostFile)} />
          <label htmlFor="cost-file">
            <motion.div className='upload-hover-effect' whileHover={{ scale: 1.10 }}>
              <Button
                variant="contained"
                color="transparent"
                component="span"
                className={`upload-file-btn ${costFile ? 'selected' : ''}`}>
                  {costFile ? `Selected: ${costFile.name}` : "Choose Worker Cost File"}
              </Button>
            </motion.div>
          </label>
        </motion.div>

        <motion.div className='upload-input-wrapper'>
          <input 
            accept=".csv" 
            className='hidden-input' 
            id="workers-file" 
            type="file" 
            onChange={handleFileChange(setWorkersFile)} />
          <label htmlFor="workers-file">
            <motion.div className='upload-hover-effect' whileHover={{ scale: 1.10 }}>
              <Button
                variant="contained"
                color="transparent"
                component="span"
                className={`upload-file-btn ${workersFile ? 'selected' : ''}`}>
                  {workersFile ? `Selected: ${workersFile.name}` : "Choose Workers List Data"}
              </Button>
            </motion.div>
        </label>
        </motion.div>

        <motion.div 
          className='upload-hover-effect'
          whileHover={{ scale: 1.10 }}>
            <motion.div
              className='upload-btn-wrapper'
              whileHover={{ scale: 1.10 }}>
                <Button
                  className='upload-all-btn'
                  variant="contained"
                  color="transparent"
                  onClick={handleUpload}
                  disabled={uploading}>
                    Upload All
                </Button>
                {error && (
                  <Typography
                    className='error-msg'
                    variant='body2'>
                      {error}
                    </Typography>
                )}
              </motion.div>
        </motion.div>
      </motion.div>
</motion.div>
  );
}

export default Upload;

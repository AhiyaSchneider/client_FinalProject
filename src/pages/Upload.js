import React, { useState } from 'react';
import { Container, Typography, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Upload.css'



function Upload({ onScheduleUpdate }) {
  const [demandFile, setDemandFile] = useState(null);
  const [costFile, setCostFile] = useState(null);
  const [workersFile, setWorkersFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();  // Hook to navigate to /schedule

  // Handle file changes
  const handleDemandFileChange = (event) => {
    setDemandFile(event.target.files[0]);
  };

  const handleCostFileChange = (event) => {
    setCostFile(event.target.files[0]);
  };

  const handleWorkersFileChange = (event) => {
    setWorkersFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!demandFile || !costFile || !workersFile) {
      alert('Please select all three files to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('demandFile', demandFile);
    formData.append('costFile', costFile);
    formData.append('workersFile', workersFile);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the schedule in the parent state and navigate to the schedule display page
      onScheduleUpdate(res.data.schedule);
      navigate('/schedule');  // Navigate to the /schedule page

    } catch (error) {
      console.error('Error uploading the files', error.response?.data || error.message);
      alert(`Failed to upload files: ${error.response?.data || error.message}`);
    } finally {
      setUploading(false);
      setDemandFile(null);
      setCostFile(null);
      setWorkersFile(null);
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(-45deg, #FF5733, #C70039, #900C3F, #581845)', // Pink to yellow to purple
        backgroundSize: '400% 400%',
        zIndex: -1,
      }}
    >
      <Container
        maxWidth="sm"
        style={{
          minHeight: '100vh',          // Full viewport height
          display: 'flex',
          justifyContent: 'center',     // Horizontal centering
          alignItems: 'center',         // Vertical centering
          flexDirection: 'column',      // Stack children vertically
          textAlign: 'center',          // Center-align text and buttons
        }}
      >

        {/* Main Container Content */}
        <motion.div
          id='motion-container-outer'
          initial={{ opacity: 0, y: -50 }} // Initial position and opacity
          animate={{ opacity: 1, y: 0 }}   // Final position and opacity
          transition={{ duration: 0.6 }}    // Duration of the animation
          style={{
            width: '70%',
            paddingTop: '2rem',
            paddingBottom: '2rem',
            overflow: 'hidden'
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, paddingBottom: 20, color: '#FFFFFF' }}
          >
            Upload Files
          </Typography>


          {/* Demand File Input */}
          <div>
            <input
              accept=".xlsx, .xls, .csv"
              style={{ display: 'none' }}
              id="demand-file"
              type="file"
              onChange={handleDemandFileChange}
            />
            <label htmlFor="demand-file">
              <motion.div whileHover={{ scale: 1.10 }} style={{ display: 'inline-block', width: '100%' }}>
                <Button
                  variant="contained"
                  color="transparent"
                  component="span"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    textTransform: 'none',
                    width: '65%',
                    border: '1.5px solid #FFFFFF',
                    borderRadius: '15px'
                  }}>
                  Choose Demand Data File
                </Button>
              </motion.div>
            </label>
            {demandFile && (
              <Typography variant="subtitle1" gutterBottom>
                Selected file: {demandFile.name}
              </Typography>
            )}
          </div>

          {/* Cost File Input */}
          <div style={{ marginTop: 20 }}>
            <input
              accept=".xlsx, .xls, .csv"
              style={{ display: 'none' }}
              id="cost-file"
              type="file"
              onChange={handleCostFileChange}
            />
            <label htmlFor="cost-file">
              <motion.div whileHover={{ scale: 1.10 }} style={{ display: 'inline-block', width: '100%' }}>
                <Button
                  variant="contained"
                  color="transparent"
                  component="span"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    textTransform: 'none',
                    width: '65%',
                    border: '1.5px solid #FFFFFF',
                    borderRadius: '15px'
                  }}>
                  Choose Worker Cost File
                </Button>
              </motion.div>
            </label>
            {costFile && (
              <Typography variant="subtitle1" gutterBottom>
                Selected file: {costFile.name}
              </Typography>
            )}
          </div>

          {/* Workers File Input */}
          <div style={{ marginTop: 20 }}>
            <input
              accept=".xlsx, .xls, .csv"
              style={{ display: 'none' }}
              id="workers-file"
              type="file"
              onChange={handleWorkersFileChange}
            />
            <label htmlFor="workers-file">
              <motion.div whileHover={{ scale: 1.10 }} style={{ display: 'inline-block', width: '100%' }}>
                <Button
                  variant="contained"
                  color="transparent"
                  component="span"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    textTransform: 'none',
                    width: '65%',
                    border: '1.5px solid #FFFFFF',
                    borderRadius: '15px'
                  }}>
                  Choose Workers List File
                </Button>
              </motion.div>
            </label>
            {workersFile && (
              <Typography variant="subtitle1" gutterBottom>
                Selected file: {workersFile.name}
              </Typography>
            )}
          </div>

          {/* Upload Button */}
          <motion.div whileHover={{ scale: 1.10 }} style={{ display: 'inline-block', width: '100%' }}>
            <Button
              variant="contained"
              color="transparent"
              onClick={handleUpload}
              disabled={uploading}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                color: '#FFFFFF',
                textTransform: 'none',
                width: '40%',
                marginTop: '20px',
                border: '1.5px solid #FFFFFF',
                borderRadius: '15px'
              }}>
              Upload All
            </Button>
          </motion.div>
          {uploading && <LinearProgress style={{ marginTop: 10 }} />}
        </motion.div>
      </Container>
    </motion.div >
  );
}

export default Upload;

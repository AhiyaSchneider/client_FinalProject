import React, { useState } from 'react';
import { Container, Typography, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Upload.css';


function Upload({ onScheduleUpdate }) {
  const [demandFile, setDemandFile] = useState(null);
  const [costFile, setCostFile] = useState(null);
  const [workersFile, setWorkersFile] = useState(null);
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
      setter(file);
    }
  };

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

      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onScheduleUpdate(res.data.schedule);
      navigate('/schedule', { state: { schedule: res.data.schedule } });
    } catch (validationError) {

      setError(error.response?.data?.message || error.message || "An unexpected error occurred.");;
    } finally {
      setUploading(false);
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
      <Container maxWidth="sm" className='content-container'>
        <motion.div
          id='motion-container-outer'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='motion-container'
        >
          <Typography variant="h4" gutterBottom className='upload-title'>
            Upload Files
          </Typography>

          {/* Demand File Input */}
          <div>
            <input accept=".csv" className='hidden-input' id="demand-file" type="file" onChange={handleFileChange(setDemandFile)} />
            <label htmlFor="demand-file">
              <motion.div className='hover-effect' whileHover={{ scale: 1.10 }}>
                <Button
                  variant="contained"
                  color="transparent"
                  component="span"
                  className='upload-file-btn'
                >
                  Choose Demand Data File
                </Button>
              </motion.div>
            </label>
            {demandFile && <Typography variant="subtitle1" gutterBottom>Selected file: {demandFile.name}</Typography>}
          </div>

          {/* Cost File Input */}
          <div style={{ marginTop: 20 }}>
            <input accept=".csv" className='hidden-input' id="cost-file" type="file" onChange={handleFileChange(setCostFile)} />
            <label htmlFor="cost-file">
              <motion.div className='hover-effect' whileHover={{ scale: 1.10 }}>
                <Button
                  variant="contained"
                  color="transparent"
                  component="span"
                  className='upload-file-btn'
                >
                  Choose Worker Cost File
                </Button>
              </motion.div>
            </label>
            {costFile && <Typography variant="subtitle1" gutterBottom>Selected file: {costFile.name}</Typography>}
          </div>

          {/* Workers File Input */}
          <div style={{ marginTop: 20 }}>
            <input accept=".csv" className='hidden-input' id="workers-file" type="file" onChange={handleFileChange(setWorkersFile)} />
            <label htmlFor="workers-file">
              <motion.div className='hover-effect' whileHover={{ scale: 1.10 }}>
                <Button
                  variant="contained"
                  color="transparent"
                  component="span"
                  className='upload-file-btn'
                >
                  Choose Workers List File
                </Button>
              </motion.div>
            </label>
            {workersFile && <Typography variant="subtitle1" gutterBottom>Selected file: {workersFile.name}</Typography>}
          </div>

          {/* Upload Button */}
          <motion.div className='hover-effect' whileHover={{ scale: 1.10 }}>
            <Button
              variant="contained"
              color="transparent"
              onClick={handleUpload}
              disabled={uploading}
              className='upload-all-btn'
            >
              Upload All
            </Button>
          </motion.div>
          {uploading && <LinearProgress style={{ marginTop: 10 }} />}
          {error && <Typography color="error" style={{ marginTop: 10 }}>{error}</Typography>}
        </motion.div>
      </Container>
    </motion.div>
  );
}

export default Upload;

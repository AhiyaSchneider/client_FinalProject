import React, { useState } from 'react';
import { Container, Typography, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Upload({ onScheduleUpdate }) {
  const [demandFile, setDemandFile] = useState(null);
  const [costFile, setCostFile] = useState(null);
  const [workersFile, setWorkersFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const requiredHeaders = {
    demandFile: ['Date', 'Time Interval', 'Worker Type', 'Demand'],
    costFile: ['Worker ID', 'Worker Name', 'Skill', 'Hourly Cost', 'Available From', 'Available Until'],
    workersFile: ['Worker ID', 'Worker Name', 'Skill', 'Available From', 'Available Until']
  };

  const handleFileChange = (setter) => (event) => {
    const file = event.target.files[0];
    if (file && file.type !== 'text/csv') {
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

      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onScheduleUpdate(res.data.schedule);
      navigate('/schedule');
    } catch (validationError) {
      setError(validationError);
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
      <Container maxWidth="sm" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <motion.div
          id='motion-container-outer'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '70%', paddingTop: '2rem', paddingBottom: '2rem', overflow: 'hidden' }}
        >
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, paddingBottom: 20, color: '#FFFFFF' }}>
            Upload Files
          </Typography>

          {/* Demand File Input */}
          <div>
            <input accept=".csv" style={{ display: 'none' }} id="demand-file" type="file" onChange={handleFileChange(setDemandFile)} />
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
                  }}
                >
                  Choose Demand Data File
                </Button>
              </motion.div>
            </label>
            {demandFile && <Typography variant="subtitle1" gutterBottom>Selected file: {demandFile.name}</Typography>}
          </div>

          {/* Cost File Input */}
          <div style={{ marginTop: 20 }}>
            <input accept=".csv" style={{ display: 'none' }} id="cost-file" type="file" onChange={handleFileChange(setCostFile)} />
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
                  }}
                >
                  Choose Worker Cost File
                </Button>
              </motion.div>
            </label>
            {costFile && <Typography variant="subtitle1" gutterBottom>Selected file: {costFile.name}</Typography>}
          </div>

          {/* Workers File Input */}
          <div style={{ marginTop: 20 }}>
            <input accept=".csv" style={{ display: 'none' }} id="workers-file" type="file" onChange={handleFileChange(setWorkersFile)} />
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
                  }}
                >
                  Choose Workers List File
                </Button>
              </motion.div>
            </label>
            {workersFile && <Typography variant="subtitle1" gutterBottom>Selected file: {workersFile.name}</Typography>}
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
              }}
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

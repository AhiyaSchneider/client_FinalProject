import React, { useState } from 'react';
import { Container, Typography, Button, LinearProgress } from '@mui/material';
import axios from 'axios';

function Upload() {
    const [demandFile, setDemandFile] = useState(null);
    const [costFile, setCostFile] = useState(null);
    const [workersFile, setWorkersFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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
            await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Files uploaded successfully');
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
        <Container>
            <Typography variant="h4" gutterBottom>
                Upload Files
            </Typography>

            {/* Demand File Input */}
            <div>
                <input
                    accept=".xlsx, .xls"
                    style={{ display: 'none' }}
                    id="demand-file"
                    type="file"
                    onChange={handleDemandFileChange}
                />
                <label htmlFor="demand-file">
                    <Button variant="contained" color="primary" component="span">
                        Choose Demand Data File
                    </Button>
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
                    accept=".xlsx, .xls"
                    style={{ display: 'none' }}
                    id="cost-file"
                    type="file"
                    onChange={handleCostFileChange}
                />
                <label htmlFor="cost-file">
                    <Button variant="contained" color="primary" component="span">
                        Choose Worker Cost File
                    </Button>
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
                    accept=".xlsx, .xls"
                    style={{ display: 'none' }}
                    id="workers-file"
                    type="file"
                    onChange={handleWorkersFileChange}
                />
                <label htmlFor="workers-file">
                    <Button variant="contained" color="primary" component="span">
                        Choose Workers List File
                    </Button>
                </label>
                {workersFile && (
                    <Typography variant="subtitle1" gutterBottom>
                        Selected file: {workersFile.name}
                    </Typography>
                )}
            </div>

            {/* Upload Button */}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleUpload}
                disabled={uploading}
                style={{ marginTop: 20 }}
            >
                Upload All Files
            </Button>
            {uploading && <LinearProgress style={{ marginTop: 10 }} />}
        </Container>
    );
}

export default Upload;

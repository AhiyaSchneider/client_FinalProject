import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Input } from '@mui/material';

function UploadFile() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading the file', error);
            alert('Failed to upload file');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Upload Files
            </Typography>
            <Input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
            </Button>
        </Container>
    );
}

export default UploadFile;

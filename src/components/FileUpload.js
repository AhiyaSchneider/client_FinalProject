import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onScheduleUpdate }) => {
    const [files, setFiles] = useState({
        demandFile: null,
        costFile: null,
        workersFile: null,
    });

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('demandFile', files.demandFile);
        formData.append('costFile', files.costFile);
        formData.append('workersFile', files.workersFile);

        try {
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Update the parent component with the received schedule
            onScheduleUpdate(res.data.schedule);
        } catch (err) {
            console.error('Error uploading files', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" name="demandFile" onChange={handleFileChange} required />
            <input type="file" name="costFile" onChange={handleFileChange} required />
            <input type="file" name="workersFile" onChange={handleFileChange} required />
            <button type="submit">Upload Files</button>
        </form>
    );
};

export default FileUpload;

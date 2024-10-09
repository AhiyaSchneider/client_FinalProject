import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function WorkerList() {
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        axios.get('/api/workers')
            .then(response => setWorkers(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Workers List
            </Typography>
            <List>
                {workers.map(worker => (
                    <ListItem key={worker._id}>
                        <ListItemText primary={`${worker.name} - Skills: ${worker.skills.join(', ')}`} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default WorkerList;

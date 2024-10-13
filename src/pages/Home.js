import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkerList from '../components/WorkerList';

function Home() {
    return (
        <Container>
            {/* Welcome Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    marginTop: 4,
                    marginBottom: 4,
                    padding: 4,
                    backgroundColor: '#f0f4f8',
                    borderRadius: 2,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Typography variant="h3" gutterBottom>
                    Welcome to Workforce Scheduler
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Optimize your workforce with ease and efficiency.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/upload"
                    sx={{ marginTop: 2 }}
                >
                    Start Scheduling
                </Button>
            </Box>

            {/* Worker List Section */}
            <WorkerList />
        </Container>
    );
}

export default Home;

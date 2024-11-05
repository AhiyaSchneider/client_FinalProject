import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ScheduleDisplay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const schedule = location.state?.schedule || []; // Access the schedule data from state

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
            <Container style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
                <Typography variant="h4" gutterBottom>Schedule Overview</Typography>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Date</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Start Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>End Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Skill</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>Workers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((shift, idx) => (
                            <tr key={idx}>
                                <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.date}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.startTime}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.endTime}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>{shift.skill}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', color: '#FFFFFF' }}>
                                    {shift.workers.map(worker => worker.workerName || worker.workerId).join(', ')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(-1)} // Go back to the previous page
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        color: '#ffffff',
                    }}
                >
                    Return
                </Button>
            </Container>
        </motion.div>
    );
};

export default ScheduleDisplay;

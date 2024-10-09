import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <Box sx={{ textAlign: 'center', p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2">
                &copy; {new Date().getFullYear()} Workforce Scheduler. All rights reserved.
            </Typography>
        </Box>
    );
}

export default Footer;


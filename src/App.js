import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Upload from './pages/Upload';
import ScheduleDisplay from './components/ScheduleDisplay';
import Home from './pages/Home';

function App() {
  const [schedule, setSchedule] = useState(null); // To store the schedule data

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Route for the Upload page */}
        <Route path="/upload" element={<Upload onScheduleUpdate={setSchedule} />} />

        {/* Route for the ScheduleDisplay page */}
        <Route path="/schedule" element={<ScheduleDisplay schedule={schedule} />} />

        {/* Default route to redirect to upload page */}
        <Route path="*" element={<Upload onScheduleUpdate={setSchedule} />} />
      </Routes>
    </Router>
  );
}

export default App;

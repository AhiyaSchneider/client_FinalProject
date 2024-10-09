import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import './App.css';

function App() {
    return (
        <Router>
            <Header />
            <div className="App-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<Upload />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;

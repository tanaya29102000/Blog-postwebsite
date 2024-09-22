
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Corrected import path
import CreatePost from './components/CreatePost';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UpdatePost from './components/UpdatePost'; // Import for the new edit page

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/home" element={<Home />} /> 
          <Route path="/CreatePost" element={<CreatePost />} /> 
          <Route path="/update-post/:id" element={<UpdatePost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
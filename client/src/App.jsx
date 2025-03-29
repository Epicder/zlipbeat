import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar.jsx';
import Rate from './components/Rate.jsx';
function App() {
  return (
    <>
    <Navbar />
    <Router>
      <Routes>
        <Route path="/rate" element={<Rate />} />
        <Route path="/:spotify_name" element={<UserProfile />} />

      </Routes>
    </Router>
    </>
  );
}

export default App;
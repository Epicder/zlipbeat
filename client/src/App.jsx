import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar.jsx';
import Rate from './components/Rate.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/rate" 
          element={
            <ProtectedRoute>
              <Rate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/:spotify_name" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
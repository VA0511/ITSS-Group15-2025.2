import React from 'react';
import { Navigate } from 'react-router-dom';

// Trainer Dashboard redirects to Profile (new main page)
const TrainerDashboard = () => {
  return <Navigate to="/trainer/profile" replace />;
};

export default TrainerDashboard;

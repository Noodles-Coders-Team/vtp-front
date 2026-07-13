import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserManagment from './pages/UserManagment';
import Navigation from './components/NavigtionBar';

import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document.title = "Video Tracker & Planner";
  });

  return (
    // This is same as <div>
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserManagment />} />
      </Routes>
    </>
  )
}

export default App;
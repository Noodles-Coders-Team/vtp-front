import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TemperatureManagment from './pages/TemperatureManagment';
import UserManagment from './pages/UserManagment';
import Navigation from './components/navigation';

import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document.title = "Weather Control";
  });

  return (
    // This is same as <div>
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/temperature" element={<TemperatureManagment />} /> */}
        <Route path="/user" element={<UserManagment />} />
      </Routes>
    </>
  )
}

export default App;
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import GamesPage from './pages/GamesPage';
import HomePage from './pages/HomePage';
import ImportPage from './pages/ImportCsvPage';
import Navigation from './components/NavigtionBar';
import UserManagmentPage from './pages/UserManagmentPage';

function App() {

  useEffect(() => {
    document.title = "Video Tracker & Planner";
  });

  return (
    // This is same as <div>
    <>
      <div>
        <Navigation />
      </div>
      <div style={{marginTop: 125}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserManagmentPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/games" element={<GamesPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
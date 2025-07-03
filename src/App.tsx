import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <Navbar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        {/* Removed /book/:id route since Home shows PDF viewer inline */}
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ModelPage from './components/ModelPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modelpage" element={<ModelPage />} />
      </Routes>
    </Router>
  );
}

export default App;

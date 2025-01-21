import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/Pages/Home/Home';
import UserDetailPage from '../src/Pages/UserDetailPage/UserDetailPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;